package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.res.MediaUploadResponse;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.exception.ErrorCode;
import com.cloudinary.Cloudinary;
// import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
    private static final long MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50MB

  
    public MediaUploadResponse uploadImage(MultipartFile file) {
        log.info("=== UPLOAD IMAGE START - Filename: '{}', Size: {} bytes, Content-Type: {} ===",
                file.getOriginalFilename(), file.getSize(), file.getContentType());

        // 1. Validate file
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            log.error("Invalid content type: {}", contentType);
            throw new AppException(ErrorCode.MESSAGE_TYPE_NOT_SUPPORTED,
                    "Chỉ hỗ trợ file ảnh. Nhận được: " + contentType);
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new AppException(ErrorCode.MESSAGE_TOO_LARGE,
                    "Ảnh không được vượt quá 5MB");
        }

        try {
            // 2. Upload options (giữ đơn giản + ổn định)
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", "chat/images",
                    "resource_type", "image"
            );

            // 3. Upload ảnh gốc
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), options);

            String url = (String) result.get("secure_url");

            // 4. Tạo thumbnail (200x200)
            String thumbnailUrl = url.replace(
                    "/upload/",
                    "/upload/c_thumb,w_200,h_200,q_auto,f_auto/"
            );

            // 5. Tạo ảnh hiển thị trong chat (resize vừa phải)
            String optimizedUrl = url.replace(
                    "/upload/",
                    "/upload/w_800,q_auto,f_auto/"
            );

            log.info("✅ UPLOAD IMAGE SUCCESS: {}", url);

            return MediaUploadResponse.builder()
                    .url(optimizedUrl)
                    .thumbnailUrl(thumbnailUrl)
                    .mimeType(contentType)
                    .mediaSize(file.getSize())
                    .build();

        } catch (Exception e) {
            log.error("❌ Cloudinary upload FAILED - Full error:", e);
            throw new AppException(ErrorCode.UPLOAD_FAILED,
                    "Upload ảnh thất bại: " + e.getMessage());
        }
    }

 
    public MediaUploadResponse uploadVideo(MultipartFile file) {
        log.info("=== UPLOAD VIDEO START - Filename: '{}', Size: {} bytes ===",
                file.getOriginalFilename(), file.getSize());

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new AppException(ErrorCode.MESSAGE_TYPE_NOT_SUPPORTED,
                    "Chỉ hỗ trợ file video (mp4, mov...)");
        }

        if (file.getSize() > MAX_VIDEO_SIZE) {
            throw new AppException(ErrorCode.MESSAGE_TOO_LARGE,
                    "Video không được vượt quá 50MB");
        }

        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", "chat/videos",
                    "resource_type", "video",
                    "invalidate", true
            );
            Map<String, Object> result
                    = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), options);

            String url = (String) result.get("secure_url");
            Integer duration = ((Number) result.getOrDefault("duration", 0)).intValue();

            // Tạo thumbnail đơn giản (Cloudinary tự xử lý)
            String thumbnailUrl = url.replace("/upload/", "/upload/so_0/c_thumb,w_300,h_200/");

            log.info("✅ UPLOAD VIDEO SUCCESS: {}", url);

            return MediaUploadResponse.builder()
                    .url(url)
                    .thumbnailUrl(thumbnailUrl)
                    .mimeType(contentType)
                    .mediaSize(file.getSize())
                    .duration(duration)
                    .build();

        } catch (Exception e) {
            log.error("❌ Cloudinary upload VIDEO FAILED", e);
            throw new AppException(ErrorCode.UPLOAD_FAILED,
                    "Upload video thất bại: " + e.getMessage());
        }
    }
}
