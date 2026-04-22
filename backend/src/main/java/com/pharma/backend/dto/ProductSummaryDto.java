package com.pharma.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO nhẹ dùng cho danh sách sản phẩm.
 * KHÔNG chứa productDescription (HTML nặng) để giảm kích thước response.
 * productDescription chỉ trả về ở endpoint GET /api/products/{id}
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDto {
    private Long id;
    private String slug;
    private String productName;
    private BigDecimal buyingPrice;
    private String shortDescription;
    private Boolean active;
}
