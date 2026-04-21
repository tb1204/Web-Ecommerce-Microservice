/**
 * ============================================================
 *  K6 TEST — USER SERVICE (Port 8081)
 *  Route qua API Gateway: /api/users/** , /api/webhook/**
 *  Rate Limit: replenishRate=20, burstCapacity=40
 *  Circuit Breaker: defaultCB (fallback /fallback/userservice)
 * ============================================================
 *
 *  Chạy: k6 run 01_user_service_test.js
 * ============================================================
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ── Custom metrics ──────────────────────────────────────────
const rateLimitRate   = new Rate('rate_limited_429');
const circuitOpenRate = new Rate('circuit_open_503');
const successRate     = new Rate('success_2xx');
const responseTrend   = new Trend('response_time_ms', true);
const totalReqs       = new Counter('total_requests');

// ── Cấu hình test ───────────────────────────────────────────
export const options = {
  scenarios: {
    // Scenario 1: Load bình thường — kiểm tra routing hoạt động
    normal_load: {
      executor: 'constant-vus',
      vus: 5,
      duration: '15s',
      tags: { scenario: 'normal' },
    },
    // Scenario 2: Burst vượt rate limit (burstCapacity=40)
    burst_rate_limit: {
      executor: 'shared-iterations',
      vus: 30,
      iterations: 100,
      maxDuration: '15s',
      startTime: '17s', // bắt đầu sau scenario 1
      tags: { scenario: 'burst' },
    },
  },
  thresholds: {
    http_req_duration:  ['p(95)<3000'],
    rate_limited_429:   ['rate>0'],       // Kỳ vọng: có request bị 429
    success_2xx:        ['rate>0'],       // Kỳ vọng: có request thành công
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  group('User Service — GET /api/users (public list)', () => {
    const res = http.get(`${BASE_URL}/api/users`, {
      tags: { endpoint: 'get_users' },
    });

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);

    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '✅ Không bị 503 (CircuitBreaker fallback)': (r) => r.status !== 503,
      '🔁 Route đúng (không phải 404 cổng sai)':  (r) => r.status !== 404 || r.body.includes('fallback') === false,
      '⏱ Response < 3s':                          (r) => r.timings.duration < 3000,
      '🚦 Rate Limit: 429 hoặc thành công':        (r) => r.status === 429 || r.status < 500,
    });

    if (res.status === 429) {
      console.log(`[Rate Limited] VU=${__VU} ITER=${__ITER} status=429`);
    } else if (res.status === 503) {
      console.log(`[CircuitBreaker OPEN] status=503 body=${res.body.substring(0, 100)}`);
    }
  });

  sleep(0.1);
}

export function handleSummary(data) {
  const passed = data.metrics['success_2xx']?.values?.rate ?? 0;
  const limited = data.metrics['rate_limited_429']?.values?.rate ?? 0;
  const open = data.metrics['circuit_open_503']?.values?.rate ?? 0;

  console.log('═══════════════════════════════════════════');
  console.log('  USER SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  replenishRate  = 20 req/s`);
  console.log(`  ⚙️  burstCapacity  = 40`);
  console.log('═══════════════════════════════════════════');
}
