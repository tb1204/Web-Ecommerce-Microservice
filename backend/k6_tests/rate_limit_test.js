import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình K6 test: Tạo ra một lượng lớn request đồng thời để kiểm tra Rate Limiting
export const options = {
    scenarios: {
        burst_test: {
            executor: 'shared-iterations',
            vus: 15,          // 15 Virtual Users gửi request đồng thời
            iterations: 60,   // Tổng cộng gửi 60 requests càng nhanh càng tốt
            maxDuration: '10s',
        },
    },
};

// Map URL tới rate limit tương ứng theo file application.yml của bạn
// Hãy bỏ comment URL bạn muốn test!

export default function () {
    // ---------------------------------------------------------------------
    // 1. PAYMENT SERVICE (Limit TỐI THIỂU: Lên nhanh 429 nhất)
    // Cấu hình: replenishRate = 5, burstCapacity = 10
    // Kỳ vọng: Vượt quá 10 request trong 1 giây -> Trả về 429 Too Many Requests
    // ---------------------------------------------------------------------
    const endpoint = 'http://localhost:8080/api/payments/test-limit';
    
    // ---------------------------------------------------------------------
    // 2. VOUCHER SERVICE (Giống payment)
    // Cấu hình: replenishRate = 5, burstCapacity = 10
    // ---------------------------------------------------------------------
    // const endpoint = 'http://localhost:8080/api/vouchers/test-limit';

    // ---------------------------------------------------------------------
    // 3. PRODUCT SERVICE (Limit CAO NHẤT: Khó dính 429)
    // Cấu hình: replenishRate = 40, burstCapacity = 80
    // Nếu muốn test product dính 429 thì phải tăng vus: 50, iterations: 200 ở phần options
    // ---------------------------------------------------------------------
    // const endpoint = 'http://localhost:8080/api/products/test-limit';

    // ---------------------------------------------------------------------
    // 4. USER SERVICE
    // Cấu hình: replenishRate = 20, burstCapacity = 40
    // ---------------------------------------------------------------------
    // const endpoint = 'http://localhost:8080/api/users/test-limit';


    // Thực hiện request GET
    const res = http.get(endpoint);

    // Kiểm tra kết quả
    // Gateway dùng Redis Rate Limiter trả về 429 nếu từ chối, hoặc các lỗi khác (401, 404, 200) nếu pass rate limit
    check(res, {
        'Rate Limited (429)': (r) => r.status === 429,
        'Pass Limit (NOT 429)': (r) => r.status !== 429,
    });
    
    // Đợi 0.1s sau mỗi request (nếu không giới hạn nó sẽ spam vài nghìn req/s)
    sleep(0.1);
}
