/**
 * ============================================================
 *  K6 TEST — PAYMENT SERVICE (Port 8085)
 *  Route qua API Gateway: /api/payments/**
 *  Rate Limit: replenishRate=5, burstCapacity=10  (THẤP NHẤT - nhạy cảm)
 *  Circuit Breaker: defaultCB (fallback /fallback/paymentservice)
 *  ⚠️  Dễ trigger 429 nhất vì limit thấp
 * ============================================================
 *
 *  Chạy: k6 run 05_payment_service_test.js
 * ============================================================
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const rateLimitRate   = new Rate('rate_limited_429');
const circuitOpenRate = new Rate('circuit_open_503');
const authErrorRate   = new Rate('auth_error_401_403');
const successRate     = new Rate('success_2xx');
const responseTrend   = new Trend('response_time_ms', true);
const totalReqs       = new Counter('total_requests');

export const options = {
  scenarios: {
    // Scenario 1: Normal load — 5 VUs * 15s = dễ dính 429 vì limit=5/s
    normal_load: {
      executor: 'constant-vus',
      vus: 8,         // > replenishRate=5 → PHẢI dính 429
      duration: '15s',
      tags: { scenario: 'normal' },
    },
    // Scenario 2: Burst — chắc chắn dính 429
    burst_rate_limit: {
      executor: 'shared-iterations',
      vus: 15,
      iterations: 60,
      maxDuration: '10s',
      startTime: '17s',
      tags: { scenario: 'burst' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    rate_limited_429:  ['rate>0.1'],  // Kỳ vọng: >10% requests bị 429 (vì limit thấp)
  },
};

const BASE_URL    = 'http://localhost:8080';
const CLERK_JWT   = __ENV.CLERK_JWT || 'YOUR_CLERK_JWT_TOKEN_HERE';
const authHeaders = { headers: { Authorization: `Bearer ${CLERK_JWT}` } };

export default function () {

  group('Payment Service — GET /api/payments (Rate limit thấp nhất)', () => {
    const res = http.get(`${BASE_URL}/api/payments`, authHeaders);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    authErrorRate.add(res.status === 401 || res.status === 403);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🚫 Rate Limited 429 (kỳ vọng dính)':  (r) => r.status === 429 || r.status < 500,
      '⚡ Circuit Breaker không open':         (r) => r.status !== 503,
      '⏱ Response < 5s':                      (r) => r.timings.duration < 5000,
    });

    if (res.status === 429) {
      console.log(`[🚫 Rate Limited] VU=${__VU} ITER=${__ITER} — Payment (limit=5/s)`);
    }
    if (res.status === 503) {
      console.log(`[⚡ Circuit OPEN] Payment Service: ${res.body.substring(0, 150)}`);
    }
  });

  // Không sleep để tăng áp lực lên rate limiter
  sleep(0.05);
}

export function handleSummary(data) {
  const passed  = data.metrics['success_2xx']?.values?.rate ?? 0;
  const limited = data.metrics['rate_limited_429']?.values?.rate ?? 0;
  const open    = data.metrics['circuit_open_503']?.values?.rate ?? 0;
  const unauth  = data.metrics['auth_error_401_403']?.values?.rate ?? 0;

  console.log('═══════════════════════════════════════════');
  console.log('  PAYMENT SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🔒 Auth Error (401/403):   ${(unauth * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%  ← phải > 0`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  replenishRate  = 5 req/s  (THẤP NHẤT)`);
  console.log(`  ⚙️  burstCapacity  = 10`);
  console.log('  💡 Kỳ vọng: dính 429 nhiều nhất trong 9 services');
  console.log('═══════════════════════════════════════════');
}
