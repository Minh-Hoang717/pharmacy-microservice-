package com.pharma.backend.dto;

import com.pharma.backend.entity.OrderItem;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    // userId đã bị xóa — backend tự lấy từ JWT token
    private String paymentMethod;
    private Long couponId;
    private List<OrderItem> orderItems;
}
