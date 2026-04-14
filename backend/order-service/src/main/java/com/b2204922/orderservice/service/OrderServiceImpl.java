package com.b2204922.orderservice.service;

import com.b2204922.orderservice.config.RabbitMQConfig;
import com.b2204922.orderservice.dto.NotificationDTO;
import com.b2204922.orderservice.entity.Order;
import com.b2204922.orderservice.entity.OrderItem;
import com.b2204922.orderservice.exception.ResourceNotFoundException;
import com.b2204922.orderservice.dto.request.OrderRequest;
import com.b2204922.orderservice.dto.response.OrderItemResponse;
import com.b2204922.orderservice.dto.response.OrderResponse;
import com.b2204922.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    private final IPaymentService paymentService;

    private final RabbitTemplate rabbitTemplate;

    // @Value("${product.service.url:http://localhost:8082}") // Chạy local
    @Value("${product.service.url:http://product-service}") //chạy eruka
    private String productServiceUrl;

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        String orderNumber = "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        List<OrderItem> entityItems = request.getItems().stream()
                .map(itemReq -> {

                    //gọi qua eruka
                    // String productServiceUrl = "http://product-service/api/products/get-category-map";
                    // gọi local
                    String url = "http://product-service/api/products/detail/" + itemReq.getProductId();
                    try {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> product = restTemplate.getForObject(url, Map.class);

                        if (product == null) {
                            throw new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + itemReq.getProductId());
                        }

                        String name = product.getOrDefault("name", "Sản phẩm").toString();

                        Object stockObj = product.get("totalStockQuantity");
                        int stock = stockObj != null ? Integer.parseInt(stockObj.toString()) : 0;

                        Object priceObj = product.get("price");
                        if (priceObj == null) {
                            throw new RuntimeException("Sản phẩm '" + name + "' không có giá!");
                        }
                        if (itemReq.getQuantity() > stock) {
                            throw new RuntimeException("Sản phẩm '" + name + "' chỉ còn " + stock + " sản phẩm trong kho!");
                        }

                        double price = Double.parseDouble(priceObj.toString());

                        //  Lấy size/thickness/color từ variant khớp variantId
                        String size = null, thickness = null, color = null, image = null;

                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> variants
                                = (List<Map<String, Object>>) product.get("variants");

                        if (variants != null && itemReq.getVariantId() != null) {
                            Map<String, Object> matchedVariant = variants.stream()
                                    .filter(v -> itemReq.getVariantId().equals(v.get("variantId")))
                                    .findFirst()
                                    .orElse(null);
                            if (matchedVariant != null) {
                                size = (String) matchedVariant.get("size");
                                thickness = (String) matchedVariant.get("thickness");
                                color = (String) matchedVariant.get("color");
                                //  Ưu tiên lấy price từ variant nếu có
                                Object variantPrice = matchedVariant.get("price");
                                if (variantPrice != null) {
                                    price = Double.parseDouble(variantPrice.toString());
                                }
                            }
                        }

                        //  Lấy ảnh primary
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> images
                                = (List<Map<String, Object>>) product.get("images");
                        if (images != null && !images.isEmpty()) {
                            Map<String, Object> primaryImg = images.stream()
                                    .filter(img -> Boolean.TRUE.equals(img.get("isPrimary")))
                                    .findFirst()
                                    .orElse(images.get(0));
                            image = (String) primaryImg.get("url");
                        }

                        return OrderItem.builder()
                                .productId(itemReq.getProductId())
                                .variantId(itemReq.getVariantId())
                                .productName(name)
                                .productImage(image) //
                                .price(price)
                                .quantity(itemReq.getQuantity())
                                .lineTotal(price * itemReq.getQuantity())
                                .size(size) //
                                .thickness(thickness) //
                                .color(color) //
                                .build();

                    } catch (Exception e) {
                        log.error("Lỗi kết nối Service: {}", e.getMessage());
                        throw new RuntimeException("Lỗi gọi Product Service: " + e.getMessage());
                    }
                })
                .collect(Collectors.toList());

//        double subTotal = entityItems.stream().mapToDouble(OrderItem::getLineTotal).sum();
//        int totalQty = entityItems.stream().mapToInt(OrderItem::getQuantity).sum();
//        double shippingFee = subTotal >= 3_000_000 ? 0.0 : 30_000.0; // khớp với frontend
//        Order.Summary summary = new Order.Summary(subTotal + shippingFee, shippingFee, totalQty);
        // 1. Tính tiền hàng gốc (Tổng lineTotal của các sản phẩm)
        double subTotal = entityItems.stream()
                .mapToDouble(OrderItem::getLineTotal)
                .sum();

// 2. Tính tổng số lượng sản phẩm (Để fix lỗi "cannot find symbol totalQty")
        int totalQty = entityItems.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

// 3. Lấy hạng thành viên từ Request gửi lên và tính chiết khấu
        double discountRate = 0.0;
        String tier = request.getMembershipTier(); // Đảm bảo OrderRequest đã có field này

        if ("SILVER".equalsIgnoreCase(tier)) {
            discountRate = 0.03;
        } else if ("GOLD".equalsIgnoreCase(tier)) {
            discountRate = 0.07;
        } else if ("DIAMOND".equalsIgnoreCase(tier)) {
            discountRate = 0.12;
        }

        double discountAmount = subTotal * discountRate;

// 4. Tính phí vận chuyển (Free ship cho đơn trên 3tr)
        double shippingFee = subTotal >= 3_000_000 ? 0.0 : 30_000.0;

// 5. TỔNG THANH TOÁN THỰC TẾ (Con số này sẽ khớp với Payment và VNPAY)
        double finalTotal = subTotal + shippingFee - discountAmount;

// 6. Gán vào đối tượng Summary để lưu xuống Database
        Order.Summary summary = new Order.Summary(
                finalTotal,
                shippingFee,
                totalQty
        );

        Order.CustomerInfo customerInfo = new Order.CustomerInfo(
                request.getName(), request.getPhone(), request.getEmail(), request.getShippingAddress()
        );
        Order.Payment payment = new Order.Payment(request.getPaymentMethod(), "PENDING", "");

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(request.getUserId())
                .note(request.getNote())
                .customerInfo(customerInfo)
                .summary(summary)
                .payment(payment)
                .items(entityItems)
                .orderStatus("PENDING")
                .cancelReason("")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

//        savedOrder.getItems().forEach(item -> {
//            callProductServiceToUpdateStock(item.getProductId(), -item.getQuantity());
//        });
        savedOrder.getItems().forEach(item -> {
            // Truyền thêm item.getVariantId() vào tham số thứ 2
            callProductServiceToUpdateStock(item.getProductId(), item.getVariantId(), -item.getQuantity());
        });

        try {
            NotificationDTO dto = NotificationDTO.builder()
                    .userId(savedOrder.getUserId())
                    .orderId(savedOrder.getId())
                    .orderNumber(savedOrder.getOrderNumber())
                    .customerName(savedOrder.getCustomerInfo().getName())
                    .customerEmail(savedOrder.getCustomerInfo().getEmail())
                    .title("Đặt hàng thành công")
                    .message("Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận.")
                    .type("ORDER_STATUS")
                    .newStatus("PENDING")
                    .build();

            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY, dto);
            log.info("Đã bắn tin RabbitMQ: Đặt hàng thành công {}", savedOrder.getOrderNumber());
        } catch (Exception e) {
            log.error("Lỗi gửi thông báo RabbitMQ: {}", e.getMessage());
        }

        return convertToOrderResponse(savedOrder);
    }
//    @Value("${payment.service.url:http://localhost:9004}")
//    private String paymentServiceUrl;
//     @Override
//     public OrderResponse createOrder(OrderRequest request) {
//         //Sinh max don hang
//         String orderNumber = "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
//         //Duyet ds items tu request va goi product service de lay thong tin
//         List<OrderItem> entityItems = request.getItems().stream()
//                 .map(itemReq -> {
//                     //Dung eureka
// //                    String url = "http://product-service/api/products/" + itemReq.getProductId();
//                     //Goi truc tiep (test local khong dung eureka)
//                     String url = "http://localhost:8082/api/products/detail/" + itemReq.getProductId();
//                     try {
//                         @SuppressWarnings("unchecked") //tat canh bao Map
//                         Map<String, Object> product = restTemplate.getForObject(url, Map.class);
//                         if (product == null) {
//                             throw new ResourceNotFoundException("Không tìm thấy sản phẩm ID: " + itemReq.getProductId());
//                         }
//                         //check so luong kho hang
//                         // int stock = Integer.parseInt(product.get("stockQuantity").toString());
//                         // String name = product.get("name").toString();
//                         String name = product.getOrDefault("name", "Sản phẩm").toString();
// // totalStockQuantity là field đúng trong Product entity
//                         Object stockObj = product.get("totalStockQuantity");
//                         int stock = stockObj != null ? Integer.parseInt(stockObj.toString()) : 0;
//                         Object priceObj = product.get("price");
//                         if (priceObj == null) {
//                             throw new RuntimeException("Sản phẩm '" + name + "' không có giá!");
//                         }
//                         if (itemReq.getQuantity() > stock) {
//                             throw new RuntimeException("Sản phẩm '" + name + "' chỉ còn " + stock + " sản phẩm trong kho. Vui lòng giảm số lượng!");
//                         }
//                         // double price = Double.parseDouble(product.get("price").toString());
//                         double price = Double.parseDouble(priceObj.toString());
//                         return OrderItem.builder()
//                                 .productId(itemReq.getProductId())
//                                 .productName(name)
//                                 .price(price)
//                                 .quantity(itemReq.getQuantity())
//                                 .lineTotal(price * itemReq.getQuantity())
//                                 .build();
//                     } catch (Exception e) {
//                         log.error("Lỗi kết nối Service: {}", e.getMessage());
//                         throw new RuntimeException("Lỗi gọi Product Service: " + e.getMessage());
//                     }
//                 })
//                 .collect(Collectors.toList());;
//         //Tinh toan summary
//         double subTotal = entityItems.stream().mapToDouble(OrderItem::getLineTotal).sum();
//         int totalQty = entityItems.stream().mapToInt(OrderItem::getQuantity).sum();
//         double shippingFee = 30000.0; //phi ship mac dinh
//         Order.Summary summary = new Order.Summary(subTotal + shippingFee, shippingFee, totalQty);
//         //Cac thong tin khac
//         Order.CustomerInfo customerInfo = new Order.CustomerInfo(
//                 request.getName(), request.getPhone(), request.getEmail(), request.getShippingAddress()
//         );
//         Order.Payment payment = new Order.Payment(request.getPaymentMethod(), "UNPAID", "");
//         //build va save
//         Order order = Order.builder()
//                 .orderNumber(orderNumber)
//                 .userId(request.getUserId())
//                 .customerInfo(customerInfo)
//                 .summary(summary)
//                 .payment(payment)
//                 .items(entityItems)
//                 .orderStatus("PENDING")
//                 .cancelReason("")
//                 .createdAt(LocalDateTime.now())
//                 .updatedAt(LocalDateTime.now())
//                 .build();
//         Order savedOrder = orderRepository.save(order);
//         savedOrder.getItems().forEach(item -> {
//             callProductServiceToUpdateStock(item.getProductId(), -item.getQuantity());
//         });
//         try {
//             NotificationDTO dto = NotificationDTO.builder()
//                     .userId(savedOrder.getUserId())
//                     .orderId(savedOrder.getId())
//                     .orderNumber(savedOrder.getOrderNumber())
//                     .customerName(savedOrder.getCustomerInfo().getName())
//                     .customerEmail(savedOrder.getCustomerInfo().getEmail())
//                     .title("Đặt hàng thành công")
//                     .message("Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận.")
//                     .type("ORDER_STATUS")
//                     .newStatus("PENDING")
//                     .build();
//             rabbitTemplate.convertAndSend(
//                     RabbitMQConfig.EXCHANGE,
//                     RabbitMQConfig.ROUTING_KEY, dto);
//             log.info("Đã bắn tin RabbitMQ: Đặt hàng thành công {}", savedOrder.getOrderNumber());
//         } catch (Exception e) {
//             log.error("Lỗi gửi thông báo RabbitMQ: {}", e.getMessage());
//         }
//         return convertToOrderResponse(savedOrder);
//     }
    // private OrderResponse convertToOrderResponse(Order order) {
    //     //Map CustomerInfo
    //     OrderResponse.CustomerInfoResponse customerInfo = OrderResponse.CustomerInfoResponse.builder()
    //             .name(order.getCustomerInfo().getName())
    //             .phone(order.getCustomerInfo().getPhone())
    //             .email(order.getCustomerInfo().getEmail())
    //             .shippingAddress(order.getCustomerInfo().getShippingAddress())
    //             .build();
    //     //Map Summary
    //     OrderResponse.SummaryResponse summary = OrderResponse.SummaryResponse.builder()
    //             .totalAmount(order.getSummary().getTotalAmount())
    //             .shippingFee(order.getSummary().getShippingFee())
    //             .totalQty(order.getSummary().getTotalQty())
    //             .build();
    //     //Map Payment
    //     OrderResponse.PaymentResponse payment = OrderResponse.PaymentResponse.builder()
    //             .method(order.getPayment().getMethod())
    //             .status(order.getPayment().getStatus())
    //             .transactionId(order.getPayment().getTransactionId())
    //             .build();
    //     return OrderResponse.builder()
    //             .id(order.getId())
    //             .orderNumber(order.getOrderNumber())
    //             .userId(order.getUserId())
    //             .orderStatus(order.getOrderStatus())
    //             .cancelReason(order.getCancelReason())
    //             .customerInfo(customerInfo)
    //             .summary(summary)
    //             .payment(payment)
    //             .createdAt(order.getCreatedAt())
    //             .updatedAt(order.getUpdatedAt())
    //             .build();
    // }
    //test fix lỗi không có items

    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse.CustomerInfoResponse customerInfo = OrderResponse.CustomerInfoResponse.builder()
                .name(order.getCustomerInfo().getName())
                .phone(order.getCustomerInfo().getPhone())
                .email(order.getCustomerInfo().getEmail())
                .shippingAddress(order.getCustomerInfo().getShippingAddress())
                .build();

        OrderResponse.SummaryResponse summary = OrderResponse.SummaryResponse.builder()
                .totalAmount(order.getSummary().getTotalAmount())
                .shippingFee(order.getSummary().getShippingFee())
                .totalQty(order.getSummary().getTotalQty())
                .build();

        OrderResponse.PaymentResponse payment = OrderResponse.PaymentResponse.builder()
                .method(order.getPayment().getMethod())
                .status(order.getPayment().getStatus())
                .transactionId(order.getPayment().getTransactionId())
                .build();

        //  THÊM: map items đầy đủ
        List<OrderItemResponse> items = order.getItems() != null
                ? order.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .productImage(item.getProductImage()) //
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .lineTotal(item.getLineTotal())
                        .size(item.getSize()) //
                        .thickness(item.getThickness()) //
                        .color(item.getColor()) //
                        .build())
                        .collect(Collectors.toList())
                : new ArrayList<>();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUserId())
                .note(order.getNote())
                .orderStatus(order.getOrderStatus())
                .cancelReason(order.getCancelReason())
                .customerInfo(customerInfo)
                .summary(summary)
                .payment(payment)
                .items(items) //  THÊM
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + id));
        return convertToOrderResponse(order);
    }

    @Override
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với mã: " + orderNumber));
        return convertToOrderResponse(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateOrderStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + id));

        String oldStatus = order.getOrderStatus();

        //  Nếu đơn đã hủy hoặc đã giao thì KHÔNG cho đổi nữa
        if ("CANCELLED".equals(oldStatus)) {
            throw new IllegalStateException("Đơn hàng đã bị hủy, không thể thay đổi trạng thái!");
        }
        if ("DELIVERED".equals(oldStatus)) {
            throw new IllegalStateException("Đơn hàng đã giao thành công, không thể thay đổi trạng thái!");
        }

        // Kiem tra tru kho
//        if ("PENDING".equals(status) && !"PENDING".equals(oldStatus)) {
//            order.getItems().forEach(item -> {
//                callProductServiceToUpdateStock(item.getProductId(), item.getVariantId(), -item.getQuantity());
//            });
//        }

        // 3. Cập nhật trạng thái
        order.setOrderStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        //membership
        // Nếu chuyển sang DELIVERED → cộng spending cho user
        if ("DELIVERED".equals(savedOrder.getOrderStatus()) && savedOrder.getUserId() != null) {
            try {
                String userServiceUrl = "http://user-service/api/users/"
                        + savedOrder.getUserId() + "/add-spending";
                Map<String, Double> spendingBody = Map.of("amount", savedOrder.getSummary().getTotalAmount());
                restTemplate.put(userServiceUrl, spendingBody);
                log.info("Đã cộng {}đ vào spending cho user {}",
                        savedOrder.getSummary().getTotalAmount(), savedOrder.getUserId());
            } catch (Exception e) {
                log.error("Lỗi gọi user-service cộng spending: {}", e.getMessage());
            }
        }


        //4 GỬI THÔNG BÁO CẬP NHẬT TRẠNG THÁI / GIAO HÀNG THÀNH CÔNG
        try {
            String title = "Cập nhật đơn hàng";
            String message = "Đơn hàng #" + savedOrder.getOrderNumber() + " đã chuyển sang trạng thái: " + status;
            String productIdForNoti = null;
            if ("DELIVERED".equals(status)) {
                title = "Giao hàng thành công";
                message = "Bạn đã nhận được hàng? Hãy chia sẻ cảm nhận với Artisano nhé!";
                if (savedOrder.getItems() != null && !savedOrder.getItems().isEmpty()) {
                    productIdForNoti = savedOrder.getItems().get(0).getProductId(); //lay id dau tien de KH vao cmt
                }
            }

            NotificationDTO dto = NotificationDTO.builder()
                    .userId(savedOrder.getUserId())
                    .orderId(savedOrder.getId())
                    .orderNumber(savedOrder.getOrderNumber())
                    .productId(productIdForNoti)
                    .customerName(savedOrder.getCustomerInfo().getName())
                    .customerEmail(savedOrder.getCustomerInfo().getEmail())
                    .title(title)
                    .message(message)
                    .type("ORDER_STATUS")
                    .newStatus(status)
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY, dto);
        } catch (Exception e) {
            log.error("Lỗi gửi thông báo cập nhật: {}", e.getMessage());
        }

        return convertToOrderResponse(savedOrder);
    }

    @Override
    public OrderResponse updatePaymentStatus(String orderNumber, String status, String transactionId) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng mã: " + orderNumber));

        order.getPayment().setStatus(status);
        order.getPayment().setTransactionId(transactionId);
        order.setUpdatedAt(LocalDateTime.now());

        return convertToOrderResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse cancelOrder(String id, String reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng ID: " + id));

        String oldStatus = order.getOrderStatus();
        // Kiểm tra trạng thái trước khi cho hủy
        if (!"PENDING".equals(order.getOrderStatus()) && !"PROCESSING".equals(order.getOrderStatus())) {
            throw new IllegalStateException("Đơn hàng đang giao hoặc đã hoàn tất, không thể hủy!");
        }

        // Kiểm tra và thực hiện hoàn tiền nếu đã thanh toán
        if (order.getPayment() != null && "PAID".equals(order.getPayment().getStatus())) {
            // Lấy ID đơn hàng và số tiền cần hoàn
            String orderId = order.getId();
            Double amount = order.getSummary().getTotalAmount();
            log.info("Đang yêu cầu hoàn tiền cho đơn hàng: {}", order.getOrderNumber());
            // Gọi sang PaymentServiceImpl
            boolean isRefunded = paymentService.refund(orderId, amount);
            if (!isRefunded) {
                // Nếu bên Payment Service báo lỗi (ví dụ VNPay từ chối) thì không cho hủy đơn
                throw new RuntimeException("Lỗi hệ thống thanh toán: Không thể hoàn tiền. Vui lòng thử lại sau!");
            }
            // Cập nhật trạng thái Payment trong Object Order để lưu vào DB của Order-Service
            order.getPayment().setStatus("REFUNDED");
            log.info("Đã xác nhận hoàn tiền thành công cho đơn hàng: {}", order.getOrderNumber());
        }

        order.setOrderStatus("CANCELLED");
        order.setCancelReason(reason);
        order.setCancelledAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
//        order.getItems().forEach(item -> {
//            callProductServiceToUpdateStock(item.getProductId(), item.getQuantity());
//        });
        order.getItems().forEach(item -> {
            // Truyền thêm item.getVariantId() vào tham số thứ 2
            callProductServiceToUpdateStock(item.getProductId(), item.getVariantId(), item.getQuantity());
        });

        Order savedOrder = orderRepository.save(order);
        try {
            NotificationDTO dto = NotificationDTO.builder()
                    .userId(savedOrder.getUserId())
                    .orderId(savedOrder.getId())
                    .orderNumber(savedOrder.getOrderNumber())
                    .customerName(savedOrder.getCustomerInfo().getName())
                    .customerEmail(savedOrder.getCustomerInfo().getEmail())
                    .title("Đơn hàng đã hủy")
                    .message("Đơn hàng #" + savedOrder.getOrderNumber() + " đã bị hủy. Lý do: " + reason)
                    .type("ORDER_STATUS")
                    .newStatus("CANCELLED")
                    .build();

            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY, dto);
        } catch (Exception e) {
            log.warn("Lỗi gửi thông báo hủy: {}", e.getMessage());
        }

        return convertToOrderResponse(savedOrder);
    }

//    private void callProductServiceToUpdateStock(String productId, int quantity) {
//        // quantity âm nếu là trừ kho (khi giao hàng/đặt hàng)
//        // quantity dương nếu là cộng lại kho (khi hủy)
//        String url = "http://localhost:8082/api/products/updateStock?productId=" + productId + "&quantity=" + quantity;
//        try {
//            restTemplate.put(url, null);
//            log.info("Đã cập nhật kho cho sản phẩm {} với số lượng {}", productId, quantity);
//        } catch (Exception e) {
//            log.error("Lỗi khi cập nhật kho tại Product Service: {}", e.getMessage());
//        }
//    }
    private void callProductServiceToUpdateStock(String productId, String variantId, int quantity) {

        // gọi qua eruka
        String url = "http://product-service/api/products/updateStock?productId=" + productId
                + "&variantId=" + variantId
                + "&quantity=" + quantity;

        //     gọi local
        // String url = "http://localhost:8082/api/products/updateStock?productId=" + productId
        //         + "&variantId=" + variantId
        //         + "&quantity=" + quantity;
        try {
            log.info(" Đang trả hàng về kho: {} (SL: {})", productId, quantity);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            restTemplate.exchange(url, org.springframework.http.HttpMethod.PUT, entity, Void.class);

            log.info(" Kho đã cập nhật xong!");
        } catch (Exception e) {
            log.error(" Lỗi Product Service: {}", e.getMessage());
        }
    }

    public boolean hasPurchased(String userId, String productId) {
        return orderRepository.existsByUserIdAndItems_ProductIdAndOrderStatus(userId, productId, "DELIVERED");
    }

    private void pushNotification(NotificationDTO dto) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE,
                    RabbitMQConfig.ROUTING_KEY,
                    dto);
            log.info("Đã đưa tin nhắn thông báo vào RabbitMQ cho đơn: {}", dto.getOrderNumber());
        } catch (Exception e) {
            log.error("Lỗi truyền tin  RabbitMQ: {}", e.getMessage());
        }
    }

    //Tinh tong doanh thu
    @Override
    public Double getTotalRevenue() {
        // Chỉ tính doanh thu từ những đơn hàng đã giao thành công (DELIVERED)
        List<Order> successfulOrders = orderRepository.findByOrderStatus("DELIVERED");
        return successfulOrders.stream()
                .mapToDouble(order -> order.getSummary().getTotalAmount())
                .sum();
    }

    //Tong don hang
    @Override
    public long getTotalOrdersCount() {
        return orderRepository.count();
    }

    //So don hang dang xu ly hoac da huy
    @Override
    public long getOrdersCountByStatus(String status) {
        return orderRepository.countByOrderStatus(status);
    }

    //Ham tinh toan doanh thu theo doanh muc
    public List<Map<String, Object>> getRevenueByCategory() {
        //Lấy tất cả đơn hàng đã giao thành công
        List<Order> orders = orderRepository.findByOrderStatus("DELIVERED");

        //Lấy danh sách tất cả Product ID duy nhất từ các đơn hàng đó
        List<String> productIds = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .map(OrderItem::getProductId)
                .distinct()
                .collect(Collectors.toList());

        //Gọi sang Product Service để lấy Map (ID -> Category) CHẠY LOCAL
        // String productServiceUrl = "http://localhost:8082/api/products/get-category-map";
        // Map<String, String> idToCategoryMap = restTemplate.postForObject(productServiceUrl, productIds, Map.class);
        //CHẠY ERUKA
        String url = productServiceUrl + "/api/products/get-category-map";
        Map<String, String> idToCategoryMap
                = restTemplate.postForObject(url, productIds, Map.class);
        //Tính toán tổng hợp
        Map<String, Double> revenueMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                // Dựa vào ID sản phẩm để tìm tên danh mục từ Map vừa lấy về
                String catName = (idToCategoryMap != null) ? idToCategoryMap.get(item.getProductId()) : "Khác";
                if (catName == null) {
                    catName = "Chưa phân loại";
                }

                double lineTotal = item.getLineTotal();
                revenueMap.put(catName, revenueMap.getOrDefault(catName, 0.0) + lineTotal);
            }
        }

        //Chuyển sang định dạng List<Map> cho Frontend dễ đọc
        return revenueMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> res = new HashMap<>();
                    res.put("name", entry.getKey());
                    res.put("giaTri", entry.getValue());
                    return res;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopSellingProducts() {
        // Chỉ lấy từ đơn hàng thành công
        List<Order> orders = orderRepository.findByOrderStatus("DELIVERED");

        Map<String, Double> productRevenue = new HashMap<>();
        Map<String, Integer> productQuantity = new HashMap<>();
        Map<String, String> productNameMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String pid = item.getProductId();
                productRevenue.put(pid, productRevenue.getOrDefault(pid, 0.0) + item.getLineTotal());
                productQuantity.put(pid, productQuantity.getOrDefault(pid, 0) + item.getQuantity());
                productNameMap.put(pid, item.getProductName());
            }
        }

        // Sắp xếp và lấy top 5
        return productRevenue.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", productNameMap.get(e.getKey()));
                    m.put("sub", productQuantity.get(e.getKey()) + " sản phẩm đã bán");
                    m.put("value", String.format("%.1fM VNĐ", e.getValue() / 1000000));
                    return m;
                }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getMostCancelledProducts() {
        // Chỉ lấy từ đơn hàng bị hủy
        List<Order> orders = orderRepository.findByOrderStatus("CANCELLED");

        Map<String, Integer> cancelCounts = new HashMap<>();
        Map<String, String> productNameMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String pid = item.getProductId();
                cancelCounts.put(pid, cancelCounts.getOrDefault(pid, 0) + 1);
                productNameMap.put(pid, item.getProductName());
            }
        }

        return cancelCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", productNameMap.get(e.getKey()));
                    m.put("sub", "Hủy " + e.getValue() + " lần");
                    m.put("value", "Kiểm tra");
                    return m;
                }).collect(Collectors.toList());
    }

    //area chart
    public List<Map<String, Object>> getRevenueByRange(LocalDate start, LocalDate end) {
        // 1. Chuyển LocalDate sang LocalDateTime để so sánh chính xác từ 00:00:00 đến 23:59:59
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX);

        // 2. Lấy đơn hàng trong khoảng ngày và đã DELIVERED
        List<Order> orders = orderRepository.findByCreatedAtBetweenAndOrderStatus(
                startDateTime, endDateTime, "DELIVERED");

        Map<String, Double> stats = new LinkedHashMap<>();
        // Format nhãn theo ngày dd/MM để biểu đồ dễ nhìn
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

        // 3. Gom dữ liệu
        for (Order order : orders) {
            String label = order.getCreatedAt().format(formatter);
            Double amount = order.getSummary().getTotalAmount();
            stats.put(label, stats.getOrDefault(label, 0.0) + (amount != null ? amount : 0.0));
        }

        return stats.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("doanhThu", e.getValue());
                    return m;
                }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopSellingDashboard() {
        // 1. Lấy tất cả đơn hàng đã giao thành công
        List<Order> orders = orderRepository.findByOrderStatus("DELIVERED");

        // 2. Map để cộng dồn số lượng theo ID sản phẩm
        Map<String, Integer> productQtyMap = new HashMap<>();
        Map<String, String> productNameMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String pid = item.getProductId();
                productQtyMap.put(pid, productQtyMap.getOrDefault(pid, 0) + item.getQuantity());
                productNameMap.put(pid, item.getProductName());
            }
        }

        // 3. Xử lý stream để lấy top 5 và format dữ liệu cho Dashboard
        return productQtyMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", productNameMap.get(e.getKey()));
                    map.put("value", e.getValue() + " lượt");
                    return map;
                })
                .collect(Collectors.toList());
    }

    //query đơn hàng theo email
    // Thêm implementation
    @Override
    public List<OrderResponse> getOrdersByEmail(String email) {
        // Tìm đơn hàng theo email trong customerInfo
        return orderRepository.findByCustomerInfoEmail(email).stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public Integer countPurchasedProduct(String userId, String productId) {
        // 1. Lấy tất cả đơn hàng của User này
        List<Order> userOrders = orderRepository.findByUserId(userId);
        System.out.println(">>> [DEBUG ORDER] Tim thay tong cong " + userOrders.size() + " don hang cua user: " + userId);
        int count = 0;

        for (Order order : userOrders) {
            // 2. Chỉ tính những đơn hàng đã giao thành công (Tránh việc đặt rồi hủy vẫn được đánh giá)
            if ("DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {

                // 3. Kiểm tra xem trong danh sách sản phẩm của đơn hàng này có productId đó không
                // Giả sử trong Order ông có List<OrderItem> items
                boolean hasProduct = order.getItems().stream()
                        .anyMatch(item -> item.getProductId().equals(productId));
                System.out.println(">>> [DEBUG ORDER] Co chua san pham can tim khong: " + hasProduct);
                if (hasProduct) {
                    count++;
                }
            }
        }

        return count;

    }

    @Override
    public List<String> getTopSellingProductIds(int limit) {
        // Chỉ lấy từ đơn hàng thành công
        List<Order> orders = orderRepository.findByOrderStatus("DELIVERED");

        Map<String, Integer> productQtyMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String pid = item.getProductId();
                productQtyMap.put(pid, productQtyMap.getOrDefault(pid, 0) + item.getQuantity());
            }
        }

        return productQtyMap.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
