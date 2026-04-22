package com.pharma.backend.controller;

import com.pharma.backend.dto.OrderRequest;
import com.pharma.backend.dto.OrderResponse;
import com.pharma.backend.dto.OrderSummaryResponse;
import com.pharma.backend.entity.Order;
import com.pharma.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders — cần token, userId lấy từ JWT
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest orderRequest,
            Authentication authentication
    ) {
        try {
            OrderSummaryResponse response = orderService.createOrder(orderRequest, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error creating order: " + e.getMessage()));
        }
    }

    // GET /api/orders/my — cần token, KHÔNG trả items (tránh over-fetching)
    @GetMapping("/my")
    public ResponseEntity<List<OrderSummaryResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getMyOrders(authentication));
    }

    // GET /api/orders/{id} — cần token, chỉ xem được đơn của chính mình
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        try {
            OrderResponse response = orderService.getOrderById(id, authentication);
            return ResponseEntity.ok(response);
        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("message", e.getReason()));
        }
    }
}
