// package com.b2204925.paymentservice.repository;
// public class PaymentRepository {
// }
package com.b2204925.paymentservice.repository;

import com.b2204925.paymentservice.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByOrderId(String orderId);

    List<Payment> findByUserId(String userId);

    List<Payment> findByUserIdOrderByCreatedAtDesc(String userId);
}
