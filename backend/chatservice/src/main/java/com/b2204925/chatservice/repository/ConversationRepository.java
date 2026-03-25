package com.b2204925.chatservice.repository;

import com.b2204925.chatservice.entity.Conversation;
import com.b2204925.chatservice.entity.ConversationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation, String> {

    // Lấy tất cả conversation của 1 user (mới nhất lên đầu)
    // Dùng khi: user xem lịch sử chat của mình
    List<Conversation> findByUserIdOrderByLastMessageAtDesc(String userId);

    // Lấy tất cả conversation theo status (mới nhất lên đầu)
    // Dùng khi: admin xem danh sách phòng chat đang WAITING/ACTIVE
    List<Conversation> findByStatusOrderByLastMessageAtDesc(ConversationStatus status);

    // Tìm conversation đang ACTIVE hoặc WAITING của 1 user
    // Dùng khi: kiểm tra user đã có phòng chat chưa trước khi tạo mới
    Optional<Conversation> findByUserIdAndStatus(String userId, ConversationStatus status);

    // Lấy tất cả conversation của admin (mới nhất lên đầu)
    // Dùng khi: admin xem các phòng mình đang phụ trách
    List<Conversation> findByAdminIdOrderByLastMessageAtDesc(String adminId);

    // Đếm số conversation đang WAITING
    // Dùng khi: admin dashboard hiển thị số phòng chờ
    long countByStatus(ConversationStatus status);
}
