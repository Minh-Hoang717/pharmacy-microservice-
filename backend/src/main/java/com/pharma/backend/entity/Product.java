package com.pharma.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "buying_price")
    private BigDecimal buyingPrice;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "product_description", columnDefinition = "LONGTEXT")
    private String productDescription;

    @Column(name = "active", nullable = false)
    private Boolean active = false;

    @Column(name = "disable_out_of_stock", nullable = false)
    private Boolean disableOutOfStock = true;

    @Column(name = "unit_id")
    private Long unitId;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
