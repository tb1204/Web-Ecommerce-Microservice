/**
 * ============================================================
 *  K6 TEST — PRODUCT SERVICE (Port 8082)
 *  Route qua API Gateway: /api/products/**, /api/categories/**
 *  Rate Limit: replenishRate=40, burstCapacity=80  (CAO NHẤT)
 *  Circuit Breaker: defaultCB (fallback /fallback/productservice)
 * ============================================================
 *
 *  Chạy: k6 run 02_product_service_test.js
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
    // Test bình thường
    normal_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '15s',
      tags: { scenario: 'normal' },
    },
    // Cần burst cao hơn vì limit là 80
    burst_rate_limit: {
      executor: 'shared-iterations',
      vus: 60,        // > burstCapacity=80 — phải đủ mạnh mới trigger 429
      iterations: 200,
      maxDuration: '20s',
      startTime: '17s',
      tags: { scenario: 'burst' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    success_2xx:       ['rate>0.3'], // product service public → phải có nhiều 2xx
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {

  group('Product Service — GET /api/products/all', () => {
    const res = http.get(`${BASE_URL}/api/products/all`, {
      tags: { endpoint: 'get_products' },
    });

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '✅ 200 OK — product list trả về':           (r) => r.status === 200,
      '🚦 Không bị rate limit ở load bình thường': (r) => r.status !== 429,
      '⚡ Không bị circuit open':                  (r) => r.status !== 503,
      '⏱ Response < 3s':                          (r) => r.timings.duration < 3000,
    });
  });

  group('Product Service — GET /api/categories/all', () => {
    const res = http.get(`${BASE_URL}/api/categories/all`, {
      tags: { endpoint: 'get_categories' },
    });

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '✅ 200 OK — categories trả về':  (r) => r.status === 200,
      '⏱ Response < 3s':               (r) => r.timings.duration < 3000,
    });
  });

  sleep(0.05);
}

export function handleSummary(data) {
  const passed  = data.metrics['success_2xx']?.values?.rate ?? 0;
  const limited = data.metrics['rate_limited_429']?.values?.rate ?? 0;
  const open    = data.metrics['circuit_open_503']?.values?.rate ?? 0;

  console.log('═══════════════════════════════════════════');
  console.log('  PRODUCT SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  replenishRate  = 40 req/s (CAO NHẤT)`);
  console.log(`  ⚙️  burstCapacity  = 80`);
  console.log('═══════════════════════════════════════════');
}
