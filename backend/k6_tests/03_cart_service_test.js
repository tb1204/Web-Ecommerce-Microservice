/**
 * ============================================================
 *  K6 TEST — CART SERVICE (Port 8083)
 *  Route qua API Gateway: /api/cart/**
 *  Rate Limit: replenishRate=25, burstCapacity=50
 *  Circuit Breaker: defaultCB (fallback /fallback/cartservice)
 *  ⚠️  Cần JWT Clerk hợp lệ để truy cập
 * ============================================================
 *
 *  Chạy: k6 run 03_cart_service_test.js
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
    normal_load: {
      executor: 'constant-vus',
      vus: 5,
      duration: '15s',
      tags: { scenario: 'normal' },
    },
    burst_rate_limit: {
      executor: 'shared-iterations',
      vus: 40,
      iterations: 150,
      maxDuration: '15s',
      startTime: '17s',
      tags: { scenario: 'burst' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    // Cart service cần auth → không cần 2xx cao
    // Chỉ cần đảm bảo circuit không mở và rate limit hoạt động
    circuit_open_503:  ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:8080';

// Điền JWT token hợp lệ từ Clerk vào đây để test authenticated routes
// Lấy từ: F12 → Application → Local Storage → clerk-db-jwt
const CLERK_JWT = __ENV.CLERK_JWT || 'YOUR_CLERK_JWT_TOKEN_HERE';

const authHeaders = {
  headers: { Authorization: `Bearer ${CLERK_JWT}` },
};

export default function () {

  group('Cart Service — GET /api/cart/{userId} (cần auth)', () => {
    const testUserId = 'test-user-id';
    const res = http.get(`${BASE_URL}/api/cart/${testUserId}`, authHeaders);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    authErrorRate.add(res.status === 401 || res.status === 403);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🛡️ Route đến đúng Cart Service':    (r) => r.status !== 404,
      '⚡ Không bị Circuit Breaker open': (r) => r.status !== 503,
      '⏱ Response < 3s':                  (r) => r.timings.duration < 3000,
      '🚦 401/403 (no auth) hoặc 200':    (r) => [200, 401, 403, 429].includes(r.status),
    });

    if (res.status === 429) {
      console.log(`[Rate Limited] VU=${__VU} status=429 — Cart Service`);
    }
  });

  // Test không có auth → phải trả 401
  group('Cart Service — Không có auth token', () => {
    const res = http.get(`${BASE_URL}/api/cart/some-user-id`);

    totalReqs.add(1);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);

    check(res, {
      '🛡️ Chặn không auth → 401/403':    (r) => r.status === 401 || r.status === 403 || r.status === 429,
      '⚡ Không phải 503 circuit open':   (r) => r.status !== 503,
    });
  });

  sleep(0.1);
}

export function handleSummary(data) {
  const passed  = data.metrics['success_2xx']?.values?.rate ?? 0;
  const limited = data.metrics['rate_limited_429']?.values?.rate ?? 0;
  const open    = data.metrics['circuit_open_503']?.values?.rate ?? 0;
  const unauth  = data.metrics['auth_error_401_403']?.values?.rate ?? 0;

  console.log('═══════════════════════════════════════════');
  console.log('  CART SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🔒 Auth Error (401/403):   ${(unauth * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  replenishRate  = 25 req/s`);
  console.log(`  ⚙️  burstCapacity  = 50`);
  console.log('═══════════════════════════════════════════');
}
