package com.pharma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO nhẹ dùng cho danh sách lịch sử đơn hàng.
 * KHÔNG chứa items để tránh over-fetching.
 * Items chỉ trả về ở endpoint GET /api/orders/{id}
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {
    private Long id;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private BigDecimal totalAmount;
    private Integer itemCount; // Số lượng loại sản phẩm trong đơn
}
