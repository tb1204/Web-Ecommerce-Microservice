package com.b2204922.orderservice.config;

//import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    @LoadBalanced // chạy eruka
    public RestTemplate loadBalancedRestTemplate() {
        // Khởi tạo factory của Apache HttpClient 5 để hỗ trợ PATCH
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();

        factory.setConnectTimeout(5000); // 5 giây kết nối

        // hoặc cấu hình trực tiếp trong HttpClient. Tạm thời cứ để factory đơn giản:
        factory.setHttpClient(HttpClients.createDefault());
        return new RestTemplate(factory);
    }
}
