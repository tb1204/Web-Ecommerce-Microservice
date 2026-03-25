// Cập nhật DialogflowResponse.java
package com.b2204925.chatservice.dto.res;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class DialogflowResponse {

    private String responseText;
    private String intent;
    private Double confidence;
    private Boolean isFallback;
    private List<String> quickReplies;  // ← thêm
}
