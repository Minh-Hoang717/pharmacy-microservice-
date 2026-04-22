package com.pharma.backend.repository;

import com.pharma.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Lấy tất cả đơn hàng của 1 user, mới nhất trước
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Lấy đơn hàng theo id VÀ userId (kiểm tra ownership)
    Optional<Order> findByIdAndUserId(Long id, Long userId);
}
