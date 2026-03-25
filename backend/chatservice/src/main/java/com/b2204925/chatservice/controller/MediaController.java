package com.b2204925.chatservice.controller;

import com.b2204925.chatservice.dto.res.MediaUploadResponse;
import com.b2204925.chatservice.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/chat/media")
@RequiredArgsConstructor
public class MediaController {

    private final CloudinaryService cloudinaryService;

    // POST /api/chat/media/image
    @PostMapping("/image")
    public ResponseEntity<MediaUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cloudinaryService.uploadImage(file));
    }

    // POST /api/chat/media/video
    @PostMapping("/video")
    public ResponseEntity<MediaUploadResponse> uploadVideo(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cloudinaryService.uploadVideo(file));
    }
}
