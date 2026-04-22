package com.pharma.backend.service;

import com.pharma.backend.dto.OrderItemResponse;
import com.pharma.backend.dto.OrderRequest;
import com.pharma.backend.dto.OrderResponse;
import com.pharma.backend.dto.OrderSummaryResponse;
import com.pharma.backend.entity.Order;
import com.pharma.backend.entity.OrderItem;
import com.pharma.backend.entity.Product;
import com.pharma.backend.entity.User;
import com.pharma.backend.repository.OrderItemRepository;
import com.pharma.backend.repository.OrderRepository;
import com.pharma.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    // ───────────────────────────────
    //  Tạo đơn hàng (lấy userId từ JWT)
    // ───────────────────────────────
    @Transactional
    public OrderSummaryResponse createOrder(OrderRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Order order = new Order();
        order.setUserId(user.getId());
        order.setPaymentMethod(
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "cash"
        );
        order.setCouponId(request.getCouponId());
        order.setStatus("pending");
        order.setPaymentStatus("unpaid");
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = request.getOrderItems();
        if (orderItems != null && !orderItems.isEmpty()) {
            for (OrderItem item : orderItems) {
                item.setOrderId(savedOrder.getId());
                if (item.getCreatedAt() == null) {
                    item.setCreatedAt(LocalDateTime.now());
                }
            }
            orderItemRepository.saveAll(orderItems);
        }

        // Trả DTO nhẹ thay vì Entity thô (tránh lộ profit, updatedBy, ...)
        return toOrderSummaryResponse(savedOrder, orderItems != null ? orderItems.size() : 0);
    }

    // ───────────────────────────────
    //  Lấy danh sách đơn hàng (không kèm items — tránh over-fetching)
    // ───────────────────────────────
    public List<OrderSummaryResponse> getMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orders.stream()
                .map(order -> {
                    int count = orderItemRepository.findByOrderId(order.getId()).size();
                    return toOrderSummaryResponse(order, count);
                })
                .collect(Collectors.toList());
    }

    // ───────────────────────────────
    //  Lấy chi tiết 1 đơn hàng
    // ───────────────────────────────
    public OrderResponse getOrderById(Long orderId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"
                ));

        return toOrderResponse(order);
    }

    // ───────────────────────────────
    //  Helper: Order → OrderResponse
    // ───────────────────────────────
    // ───────────────────────────────
    //  Helper: Order → OrderSummaryResponse (cho list, không có items)
    // ───────────────────────────────
    private OrderSummaryResponse toOrderSummaryResponse(Order order, int itemCount) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        BigDecimal totalAmount = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderSummaryResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .totalAmount(totalAmount)
                .itemCount(itemCount)
                .build();
    }

    // ───────────────────────────────
    //  Helper: Order → OrderResponse (cho detail, có đầy đủ items)
    // ───────────────────────────────
    private OrderResponse toOrderResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        // Lấy tên sản phẩm từ productId (batch query để tránh N+1)
        List<Long> productIds = items.stream()
                .map(OrderItem::getProductId)
                .collect(Collectors.toList());

        Map<Long, String> productNameMap = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, Product::getProductName));

        List<OrderItemResponse> itemResponses = items.stream()
                .map(item -> {
                    BigDecimal subtotal = item.getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    return OrderItemResponse.builder()
                            .productId(item.getProductId())
                            .productName(productNameMap.getOrDefault(item.getProductId(), "Unknown"))
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemResponses.stream()
                .map(OrderItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .totalAmount(totalAmount)
                .items(itemResponses)
                .build();
    }
}
