/**
 * ============================================================
 *  K6 TEST — CHAT SERVICE (Port 8086)
 *  Route qua API Gateway:
 *    - /api/chat/**           → chatservice-http (có Rate Limiter)
 *    - /api/chat/dialogflow/webhook → dialogflow-webhook (KHÔNG có Rate Limiter)
 *    - /ws/**                 → chatservice-ws (WebSocket)
 *  Rate Limit HTTP: replenishRate=15, burstCapacity=30
 *  Circuit Breaker: defaultCB (fallback /fallback/chatservice)
 * ============================================================
 *
 *  Chạy: k6 run 07_chat_service_test.js
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
    // Test route HTTP bình thường
    normal_load: {
      executor: 'constant-vus',
      vus: 10,
      duration: '15s',
      tags: { scenario: 'normal' },
    },
    // Burst vượt Rate Limit (burstCapacity=30)
    burst_rate_limit: {
      executor: 'shared-iterations',
      vus: 25,
      iterations: 80,
      maxDuration: '15s',
      startTime: '17s',
      tags: { scenario: 'burst' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<4000'],
    circuit_open_503:  ['rate<0.05'],
  },
};

const BASE_URL    = 'http://localhost:8080';
const CLERK_JWT   = __ENV.CLERK_JWT || 'YOUR_CLERK_JWT_TOKEN_HERE';
const authHeaders = { headers: { Authorization: `Bearer ${CLERK_JWT}` } };

// Điền adminId và userId thật từ DB
const ADMIN_ID = __ENV.ADMIN_ID || 'REPLACE_WITH_ADMIN_CLERK_ID';
const USER_ID  = __ENV.USER_ID  || 'REPLACE_WITH_USER_CLERK_ID';

export default function () {

  // 1. Lấy lịch sử chat (cần auth)
  group('Chat Service — GET /api/chat/history (cần auth)', () => {
    const res = http.get(
      `${BASE_URL}/api/chat/history?adminId=${ADMIN_ID}&userId=${USER_ID}`,
      authHeaders
    );

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    authErrorRate.add(res.status === 401 || res.status === 403);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🛡️ Route đúng đến Chat Service':       (r) => r.status !== 404,
      '⚡ CircuitBreaker chưa mở':             (r) => r.status !== 503,
      '⏱ Response < 4s':                      (r) => r.timings.duration < 4000,
      '🚦 Có phản hồi hợp lệ':               (r) => [200, 401, 403, 429].includes(r.status),
    });

    if (res.status === 429) console.log(`[🚫 Rate Limited] VU=${__VU} — Chat HTTP (limit=15/s)`);
    if (res.status === 503) console.log(`[⚡ Circuit OPEN] Chat Service down!`);
  });

  // 2. Dialogflow webhook — KHÔNG có Rate Limiter, KHÔNG có Auth check
  group('Chat Service — POST /api/chat/dialogflow/webhook (no rate limit)', () => {
    const webhookPayload = JSON.stringify({
      queryResult: { queryText: 'test', intent: { displayName: 'Default Welcome Intent' } }
    });

    const res = http.post(
      `${BASE_URL}/api/chat/dialogflow/webhook`,
      webhookPayload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🤖 Dialogflow webhook không bị 429':  (r) => r.status !== 429,  // Không có rate limiter
      '⚡ Không bị 503':                     (r) => r.status !== 503,
      '🔓 Không cần auth (Authorization bị remove)': (r) => r.status !== 401,
    });

    if (res.status === 429) {
      console.warn('[⚠️  BUG] Dialogflow webhook bị 429 — route không đúng!');
    }
  });

  // 3. Lấy danh sách cuộc hội thoại (admin)
  group('Chat Service — GET /api/chat/conversations (admin)', () => {
    const res = http.get(`${BASE_URL}/api/chat/conversations`, authHeaders);

    totalReqs.add(1);
    responseTrend.add(res.timings.duration);
    rateLimitRate.add(res.status === 429);
    circuitOpenRate.add(res.status === 503);
    successRate.add(res.status >= 200 && res.status < 300);

    check(res, {
      '🛡️ Route đúng':   (r) => r.status !== 404,
      '⚡ Không 503':    (r) => r.status !== 503,
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
  console.log('  CHAT SERVICE — KẾT QUẢ KIỂM TRA');
  console.log('═══════════════════════════════════════════');
  console.log(`  ✅ Thành công (2xx):       ${(passed * 100).toFixed(1)}%`);
  console.log(`  🔒 Auth Error (401/403):   ${(unauth * 100).toFixed(1)}%`);
  console.log(`  🚫 Rate Limited (429):     ${(limited * 100).toFixed(1)}%`);
  console.log(`  ⚡ Circuit Open (503):     ${(open * 100).toFixed(1)}%`);
  console.log(`  ⚙️  HTTP route: replenishRate=15, burstCapacity=30`);
  console.log(`  ⚙️  Dialogflow webhook: Không có Rate Limiter`);
  console.log(`  ⚙️  WebSocket (/ws/**): Không test được bằng HTTP`);
  console.log('═══════════════════════════════════════════');
}
