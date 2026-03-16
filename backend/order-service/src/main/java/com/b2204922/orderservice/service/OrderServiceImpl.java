package com.b2204922.orderservice.service;

import com.b2204922.orderservice.entity.Order;
import com.b2204922.orderservice.entity.OrderItem;
import com.b2204922.orderservice.exception.ResourceNotFoundException;
import com.b2204922.orderservice.dto.request.OrderRequest;
import com.b2204922.orderservice.dto.response.OrderResponse;
import com.b2204922.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements IOrderService {
    private final OrderRepository orderRepository;
    private final RestTemplate restTemplate;

    private final NotificationClientService notificationClientService;

    private final IPaymentService paymentService;

    @Value("${product.service.url:http://localhost:8081}") // Cổng của product-service bạn đang dùng
    private String productServiceUrl;

//    @Value("${payment.service.url:http://localhost:9004}")
//    private String paymentServiceUrl;


    @Override
    public OrderResponse createOrder(OrderRequest request) {
        //Sinh max don hang
        String orderNumber = "ORD" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        //Duyet ds items tu request va goi product service de lay thong tin
        List<OrderItem> entityItems = request.getItems().stream()
                .map(itemReq -> {
                    //Dung eureka
//                    String url = "http://product-service/api/products/" + itemReq.getProductId();
                    //Goi truc tiep (test local khong dung eureka)
                    String url = "http://localhost:9001/api/products/detail/" + itemReq.getProductId();
                    try {
                        @SuppressWarnings("unchecked") //tat canh bao Map
                        Map<String, Object> product = restTemplate.getForObject(url, Map.class);

                        if(product == null){
                            throw new ResourceNotFoundException("Không tìm thấy sản phẩm ID: "+itemReq.getProductId());
                        }

                        //check so luong kho hang
                        int stock = Integer.parseInt(product.get("stockQuantity").toString());
                        String name = product.get("name").toString();
                        if (itemReq.getQuantity() > stock) {
                            throw new RuntimeException("Sản phẩm '" + name + "' chỉ còn " + stock + " sản phẩm trong kho. Vui lòng giảm số lượng!");
                        }

                        double price = Double.parseDouble(product.get("price").toString());

                        return OrderItem.builder()
                                .productId(itemReq.getProductId())
                                .productName(name)
                                .price(price)
                                .quantity(itemReq.getQuantity())
                                .lineTotal(price*itemReq.getQuantity())
                                .build();
                    } catch(Exception e){
                        log.error("Lỗi kết nối Service: {}", e.getMessage());
                        throw new RuntimeException("Lỗi gọi Product Service: " + e.getMessage());
                    }
                })
                .collect(Collectors.toList());;

        //Tinh toan summary
        double subTotal = entityItems.stream().mapToDouble(OrderItem::getLineTotal).sum();
        int totalQty = entityItems.stream().mapToInt(OrderItem::getQuantity).sum();
        double shippingFee = 30000.0; //phi ship mac dinh
        Order.Summary summary = new Order.Summary(subTotal+shippingFee, shippingFee, totalQty);

        //Cac thong tin khac
        Order.CustomerInfo customerInfo = new Order.CustomerInfo(
                request.getName(), request.getPhone(), request.getEmail(), request.getShippingAddress()
        );
        Order.Payment payment = new Order.Payment(request.getPaymentMethod(), "UNPAID", "");



        //build va save
        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(request.getUserId())
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

        savedOrder.getItems().forEach(item -> {
            callProductServiceToUpdateStock(item.getProductId(), -item.getQuantity());
        });

        try {
            notificationClientService.sendOrderStatusNotification(
                    savedOrder.getUserId(),
                    savedOrder.getId(),
                    savedOrder.getOrderNumber(),
                    savedOrder.getCustomerInfo().getName(),
                    savedOrder.getCustomerInfo().getEmail(),
                    savedOrder.getCustomerInfo().getPhone(),
                    "Mới", // Trạng thái cũ
                    "PENDING" // Trạng thái mới
            );
        } catch (Exception e) {
            log.error("Chưa gửi được email thông báo: {}", e.getMessage());
        }

        return convertToOrderResponse(savedOrder);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        //Map CustomerInfo
        OrderResponse.CustomerInfoResponse customerInfo = OrderResponse.CustomerInfoResponse.builder()
                .name(order.getCustomerInfo().getName())
                .phone(order.getCustomerInfo().getPhone())
                .email(order.getCustomerInfo().getEmail())
                .shippingAddress(order.getCustomerInfo().getShippingAddress())
                .build();

        //Map Summary
        OrderResponse.SummaryResponse summary = OrderResponse.SummaryResponse.builder()
                .totalAmount(order.getSummary().getTotalAmount())
                .shippingFee(order.getSummary().getShippingFee())
                .totalQty(order.getSummary().getTotalQty())
                .build();

        //Map Payment
        OrderResponse.PaymentResponse payment = OrderResponse.PaymentResponse.builder()
                .method(order.getPayment().getMethod())
                .status(order.getPayment().getStatus())
                .transactionId(order.getPayment().getTransactionId())
                .build();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUserId())
                .orderStatus(order.getOrderStatus())
                .cancelReason(order.getCancelReason())
                .customerInfo(customerInfo)
                .summary(summary)
                .payment(payment)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    @Override
    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: "+id));
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
        if ("PENDING".equals(status) && !"PENDING".equals(oldStatus)) {
            order.getItems().forEach(item -> {
                callProductServiceToUpdateStock(item.getProductId(), -item.getQuantity());
            });
        }

        // 3. Cập nhật trạng thái
        order.setOrderStatus(status);
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // 4. Gửi thông báo mail
        try {
            notificationClientService.sendOrderStatusNotification(
                    savedOrder.getUserId(),
                    savedOrder.getId(),
                    savedOrder.getOrderNumber(),
                    savedOrder.getCustomerInfo().getName(),
                    savedOrder.getCustomerInfo().getEmail(),
                    savedOrder.getCustomerInfo().getPhone(),
                    oldStatus,
                    status
            );
        } catch (Exception e) {
            log.error("Thông báo gửi mail thất bại: {}", e.getMessage());
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
        if (!"PENDING".equals(order.getOrderStatus())) {
            throw new IllegalStateException("Chỉ có thể hủy khi đơn hàng đang chờ xác nhận!");
        }

        //Kiem tra hoan tien
        if (order.getPayment() != null && "PAID".equals(order.getPayment().getStatus())) {
            String txId = order.getPayment().getTransactionId();
            Double amount = order.getSummary().getTotalAmount();

            if (txId != null) {
                boolean isRefunded = paymentService.refund(txId, amount);
                if (!isRefunded) {
                    throw new RuntimeException("Lỗi hoàn tiền! Không thể hủy đơn hàng lúc này.");
                }
                order.getPayment().setStatus("REFUNDED"); // Cập nhật trạng thái tiền
                log.info("Đã hoàn tiền thành công cho đơn hàng {}", order.getOrderNumber());
            }
        }

        /// //
        order.setOrderStatus("CANCELLED");
        order.setCancelReason(reason);
        order.setCancelledAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        order.getItems().forEach(item -> {
            callProductServiceToUpdateStock(item.getProductId(), item.getQuantity());
        });

        Order savedOrder = orderRepository.save(order);
        try {
            notificationClientService.sendOrderStatusNotification(
                    savedOrder.getUserId(),
                    savedOrder.getId(),
                    savedOrder.getOrderNumber(),
                    savedOrder.getCustomerInfo().getName(),
                    savedOrder.getCustomerInfo().getEmail(),
                    savedOrder.getCustomerInfo().getPhone(),
                    oldStatus,   // Thường là "PENDING"
                    "CANCELLED"  // Trạng thái mới
            );
            log.info("Đã gửi lệnh thông báo hủy đơn hàng {} sang Notification Service", savedOrder.getOrderNumber());
        } catch (Exception e) {
            // Chỉ log lỗi chứ không làm sập luồng chính của khách
            log.warn("Lỗi gọi Notification Service (có thể do chưa khởi động): {}", e.getMessage());
        }

        return convertToOrderResponse(savedOrder);
    }

    private void callProductServiceToUpdateStock(String productId, int quantity) {
        // quantity âm nếu là trừ kho (khi giao hàng/đặt hàng)
        // quantity dương nếu là cộng lại kho (khi hủy)
        String url = "http://localhost:9001/api/products/updateStock?productId=" + productId + "&quantity=" + quantity;
        try {
            restTemplate.put(url, null);
            log.info("Đã cập nhật kho cho sản phẩm {} với số lượng {}", productId, quantity);
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật kho tại Product Service: {}", e.getMessage());
        }
    }
}
