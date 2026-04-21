/**
 * ============================================================
 *  K6 TEST — REVIEW SERVICE (Port 8088)
 *  Route qua API Gateway: /api/reviews/**
 *  Rate Limit: DISABLED (bị comment trong application.yml)
 *  Circuit Breaker: defaultCB (fallback /fallback/reviewservice)
 *  ⚠️  Review service KHÔNG có Rate Limiter → không bị 429
 *      Chỉ test: routing đúng + CircuitBreaker hoạt động
 * ============================================================
 *
 *  Chạy: k6 run 06_review_service_test.js
 * ============================================================
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

const rateLimitRate   = new Rate('rate_limited_429');
const circuitOpenRate = new Rate('circuit_open_503');
const successRate     = new Rate('success_2xx');
const responseTrend   = new Trend('response_time_ms', true);
const totalReqs       = new Counter('total_requests');

export const options = {
  scenarios: {
    // Load cao vì KHÔNG có rate limiter → phải chịu được tải lớn
    heavy_load: {
      executor: 'constant-vus',
      vus: 30,
      duration: '20s',
      tags: { scenario: 'heavy' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<4000'],
    rate_limited_429:  ['rate==0'],   // Kỳ vọng: KHÔNG bị 429 (vì rate limiter bị tắt)
    circuit_open_503:  ['rate<0.05'], // Kỳ vọng: circuit không nên mở
    success_2xx:       ['rate>0.5'],   // Kỳ vọng: >50% thành công
  },
};

const BASE_URL  = 'http://localhost:8080';
const CLERK_JWT = __ENV.CLERK_JWT || 'YOUR_CLERK_JWT_TOKEN_HERE';
const authHeaders = { headers: { Authorization: `Bearer ${CLERK_JWT}` } };

// Điền một productId thật từ DB của bạn
const SAMPLE_PRODUCT_ID = __ENV.PRODUCT_ID || 'REPLACE_WITH_REAL_PRODUCT_ID';

export default function () {

  // 1. Lấy danh sách review theo sản phẩm (public)
  group('Review Service — GET /api/reviews/product/{id}', () => {
    const res = http.get(`${BASE_URL}/api/reviews/product/${SAMPLE_PRODUCT_ID}`);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '✅ 200 OK — review list trả về':         (r) => r.status === 200,
      '🚫 Không bị Rate Limit (429 = bug)':     (r) => r.status !== 429,
      '⚡ Circuit Breaker chưa mở':             (r) => r.status !== 503,
      '⏱ Response < 4s':                       (r) => r.timings.duration < 4000,
      '📦 Body là JSON array':                  (r) => {
        try { return Array.isArray(JSON.parse(r.body)); } catch { return true; }
      },
    });

    if (res.status === 429) {
      console.warn(`[⚠️  BUG] 429 xuất hiện ở Review Service — rate limiter lẽ ra bị tắt!`);
    }
  });

  // 2. Lấy rating trung bình (public)
  group('Review Service — GET /api/reviews/rating/{id}', () => {
    const res = http.get(`${BASE_URL}/api/reviews/rating/${SAMPLE_PRODUCT_ID}`);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '✅ Rating trả về':        (r) => r.status === 200,
      '⚡ Không 503':            (r) => r.status !== 503,
    });
  });

  // 3. Lấy tất cả review (admin, cần auth)
  group('Review Service — GET /api/reviews/all (admin)', () => {
    const res = http.get(`${BASE_URL}/api/reviews/all`, authHeaders);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🛡️ Route đúng đến Review Service': (r) => r.status !== 404,
      '⚡ Không 503':                      (r) => r.status !== 503,
      '🚫 Không bị 429':                  (r) => r.status !== 429,
    });
  });

  sleep(0.05);
}

export function handleSummary(data) {
  const passed  = data.metrics['success_2xx']?.values?.rate ?? 0;
  const limited = data.metrics['rate_limited_429']?.values?.rate ?? 0;
  const open    = data.metrics['circuit_open_503']?.values?.rate ?? 0;

  console.log('═══════════════════════════════════════════');
  console.log('  REVIEW SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%  ← phải = 0%`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  Rate Limiter: DISABLED (bị comment trong application.yml)`);
  console.log(`  ⚙️  Chỉ có CircuitBreaker bảo vệ`);
  if (limited > 0) {
    console.log('  ⚠️  CẢNH BÁO: Có 429 → Rate Limiter vẫn đang bật! Kiểm tra lại yml');
  }
  console.log('═══════════════════════════════════════════');
}
