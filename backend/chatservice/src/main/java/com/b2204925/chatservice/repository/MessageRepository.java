package com.b2204925.chatservice.repository;

import com.b2204925.chatservice.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    // Lấy tất cả tin nhắn trong 1 phòng (cũ nhất lên đầu)
    // Dùng khi: load lịch sử chat
    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    // Lấy tin nhắn có phân trang (mới nhất lên đầu)
    // Dùng khi: load thêm tin nhắn cũ (infinite scroll)
    // VD: page=0, size=20 → lấy 20 tin nhắn mới nhất
    Page<Message> findByConversationIdOrderByCreatedAtDesc(String conversationId, Pageable pageable);

    // Đếm số tin nhắn trong 1 phòng
    // Dùng khi: hiển thị số tin nhắn
    long countByConversationId(String conversationId);

    // Lấy tin nhắn của 1 người gửi trong 1 phòng
    // Dùng khi: tìm kiếm tin nhắn
    List<Message> findByConversationIdAndSenderId(String conversationId, String senderId);
}
