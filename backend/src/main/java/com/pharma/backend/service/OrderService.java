package com.pharma.backend.service;

import com.pharma.backend.dto.OrderRequest;
import com.pharma.backend.entity.Order;
import com.pharma.backend.entity.OrderItem;
import com.pharma.backend.repository.OrderItemRepository;
import com.pharma.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public Order createOrder(OrderRequest request) {
        
        // Manual mapping from OrderRequest to Order entity
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCouponId(request.getCouponId());
        
        // Set default values just in case
        order.setStatus("pending");
        order.setPaymentStatus("unpaid");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = request.getOrderItems();

        // Save the order first to generate the ID
        Order savedOrder = orderRepository.save(order);

        // Set the order ID for all order items and save them
        if (orderItems != null && !orderItems.isEmpty()) {
            for (OrderItem item : orderItems) {
                item.setOrderId(savedOrder.getId());
                if (item.getCreatedAt() == null) {
                    item.setCreatedAt(LocalDateTime.now());
                }
            }
            orderItemRepository.saveAll(orderItems);
        }

        return savedOrder;
    }
}
