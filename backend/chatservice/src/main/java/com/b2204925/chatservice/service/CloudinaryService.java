package com.b2204925.chatservice.service;

import com.b2204925.chatservice.dto.res.MediaUploadResponse;
import com.b2204925.chatservice.exception.AppException;
import com.b2204925.chatservice.exception.ErrorCode;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
    private static final long MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50MB

    public MediaUploadResponse uploadImage(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.MESSAGE_TYPE_NOT_SUPPORTED,
                    "Chỉ hỗ trợ file ảnh (jpg, png, gif...)");
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new AppException(ErrorCode.MESSAGE_TOO_LARGE,
                    "Ảnh không được vượt quá 5MB");
        }

        try {
            Map result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "chat/images",
                            "resource_type", "image",
                            "eager", "c_thumb,w_200,h_200"
                    // Tạo thumbnail 200x200 tự động
                    )
            );

            String url = (String) result.get("secure_url");

            // Lấy thumbnail URL từ eager transform
            String thumbnailUrl = null;
            var eager = (java.util.List) result.get("eager");
            if (eager != null && !eager.isEmpty()) {
                thumbnailUrl = (String) ((Map) eager.get(0)).get("secure_url");
            }

            log.info("Uploaded image: {}", url);

            return MediaUploadResponse.builder()
                    .url(url)
                    .thumbnailUrl(thumbnailUrl != null ? thumbnailUrl : url)
                    .mimeType(file.getContentType())
                    .mediaSize(file.getSize())
                    .build();

        } catch (Exception e) {
            log.error("Upload image failed: ", e);
            throw new AppException(ErrorCode.UPLOAD_FAILED, "Upload ảnh thất bại");
        }
    }

    public MediaUploadResponse uploadVideo(MultipartFile file) {
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
            Map result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "chat/videos",
                            "resource_type", "video",
                            "eager", "so_0/c_thumb,w_200,h_200"
                    // Tạo thumbnail từ frame đầu tiên của video
                    )
            );

            String url = (String) result.get("secure_url");
            Integer duration = ((Number) result.getOrDefault("duration", 0)).intValue();

            String thumbnailUrl = null;
            var eager = (java.util.List) result.get("eager");
            if (eager != null && !eager.isEmpty()) {
                thumbnailUrl = (String) ((Map) eager.get(0)).get("secure_url");
            }

            log.info("Uploaded video: {}", url);

            return MediaUploadResponse.builder()
                    .url(url)
                    .thumbnailUrl(thumbnailUrl)
                    .mimeType(file.getContentType())
                    .mediaSize(file.getSize())
                    .duration(duration)
                    .build();

        } catch (Exception e) {
            log.error("Upload video failed: ", e);
            throw new AppException(ErrorCode.UPLOAD_FAILED, "Upload video thất bại");
        }
    }
}
