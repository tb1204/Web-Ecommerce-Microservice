package com.b2204925.chatservice.dto.res;

import com.b2204925.chatservice.entity.MessageMetadata;
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
    private List<String> quickReplies;
    private List<MessageMetadata.ProductLink> productLinks; // ← từ webhook payload
}
