/**
 * ============================================================
 *  K6 TEST — VOUCHER SERVICE (Port 8089)
 *  Route qua API Gateway: /api/vouchers/**, /api/admin/vouchers/**
 *  Rate Limit: replenishRate=5, burstCapacity=10  (THẤP - giống Payment)
 *  Circuit Breaker: defaultCB (fallback /fallback/voucherservice)
 *  ⚠️  Dễ trigger 429 (limit thấp như Payment)
 * ============================================================
 *
 *  Chạy: k6 run 08_voucher_service_test.js
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
    // 8 VUs > replenishRate=5 → PHẢI dính 429
    normal_load: {
      executor: 'constant-vus',
      vus: 8,
      duration: '15s',
      tags: { scenario: 'normal' },
    },
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
    http_req_duration: ['p(95)<3000'],
    rate_limited_429:  ['rate>0.1'],  // Kỳ vọng: >10% bị 429
    circuit_open_503:  ['rate<0.05'],
  },
};

const BASE_URL    = 'http://localhost:8080';
const CLERK_JWT   = __ENV.CLERK_JWT || 'YOUR_CLERK_JWT_TOKEN_HERE';
const authHeaders = { headers: { Authorization: `Bearer ${CLERK_JWT}` } };

// Mã voucher mẫu để test apply
const SAMPLE_VOUCHER_CODE = __ENV.VOUCHER_CODE || 'ARTISANO10';

export default function () {

  // 1. Validate voucher (public hoặc cần auth tùy backend)
  group('Voucher Service — GET /api/vouchers/validate', () => {
    const res = http.get(
      `${BASE_URL}/api/vouchers/validate?code=${SAMPLE_VOUCHER_CODE}`,
      authHeaders
    );

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    authErrorRate.add(res.status === 401 || res.status === 403);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🛡️ Route đúng Voucher Service':  (r) => r.status !== 404,
      '⚡ Không bị 503':               (r) => r.status !== 503,
      '⏱ Response < 3s':              (r) => r.timings.duration < 3000,
      '🚦 429 hoặc phản hồi hợp lệ':  (r) => r.status === 429 || r.status < 500,
    });

    if (res.status === 429) {
      console.log(`[🚫 Rate Limited] VU=${__VU} ITER=${__ITER} — Voucher (limit=5/s)`);
    }
  });

  // 2. Lấy danh sách voucher (admin route)
  group('Voucher Service — GET /api/admin/vouchers (admin)', () => {
    const res = http.get(`${BASE_URL}/api/admin/vouchers`, authHeaders);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    authErrorRate.add(res.status === 401 || res.status === 403);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🛡️ Route admin/vouchers đúng': (r) => r.status !== 404,
      '⚡ Không bị 503':              (r) => r.status !== 503,
      '🚦 Có phản hồi':              (r) => r.status > 0,
    });
  });

  // 3. Lấy tất cả voucher (public list)
  group('Voucher Service — GET /api/vouchers (public list)', () => {
    const res = http.get(`${BASE_URL}/api/vouchers`);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '✅ Voucher list hoặc 429':  (r) => r.status === 200 || r.status === 429,
      '⚡ Không 503':              (r) => r.status !== 503,
    });
  });

  sleep(0.05);
}

export function handleSummary(data) {
  const passed  = data.metrics['success_2xx']?.values?.rate ?? 0;
  const limited = data.metrics['rate_limited_429']?.values?.rate ?? 0;
  const open    = data.metrics['circuit_open_503']?.values?.rate ?? 0;
  const unauth  = data.metrics['auth_error_401_403']?.values?.rate ?? 0;

  console.log('═══════════════════════════════════════════');
  console.log('  VOUCHER SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🔒 Auth Error (401/403):   ${(unauth * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%  ← phải > 0`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  replenishRate  = 5 req/s  (THẤP — như Payment)`);
  console.log(`  ⚙️  burstCapacity  = 10`);
  console.log('═══════════════════════════════════════════');
}
