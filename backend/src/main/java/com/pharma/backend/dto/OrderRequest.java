package com.pharma.backend.dto;

import com.pharma.backend.entity.OrderItem;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private String paymentMethod;
    private Long couponId;
    private List<OrderItem> orderItems;
}
