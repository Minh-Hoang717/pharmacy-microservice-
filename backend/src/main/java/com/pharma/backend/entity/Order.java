package com.pharma.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coupon_id")
    private Long couponId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "status", columnDefinition = "ENUM('pending','confirmed','shipping','completed','cancelled','refunded','failed') DEFAULT 'pending'")
    private String status = "pending";

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod = "cash";

    @Column(name = "payment_status", nullable = false, columnDefinition = "ENUM('unpaid','paid','failed') DEFAULT 'unpaid'")
    private String paymentStatus = "unpaid";

    @Column(name = "order_approved_at")
    private LocalDateTime orderApprovedAt;

    @Column(name = "order_delivered_carrier_date")
    private LocalDateTime orderDeliveredCarrierDate;

    @Column(name = "order_delivered_customer_date")
    private LocalDateTime orderDeliveredCustomerDate;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "profit")
    private BigDecimal profit;
}
