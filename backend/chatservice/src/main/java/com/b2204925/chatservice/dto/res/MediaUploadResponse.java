package com.b2204925.chatservice.dto.res;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MediaUploadResponse {

    private String url;
    private String thumbnailUrl;
    private String mimeType;
    private Long mediaSize;
    private Integer duration;  // giây, chỉ có khi video
}
