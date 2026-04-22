package com.pharma.backend.repository;

import com.pharma.backend.dto.ProductSummaryDto;
import com.pharma.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Giữ lại để tương thích ngược (dùng nội bộ nếu cần)
    List<Product> findByActiveTrue();

    // Phân trang nhẹ: chỉ SELECT các cột cần thiết, bỏ productDescription
    @Query("""
            SELECT new com.pharma.backend.dto.ProductSummaryDto(
                p.id, p.slug, p.productName, p.buyingPrice, p.shortDescription, p.active
            )
            FROM Product p
            WHERE p.active = true
            """)
    Page<ProductSummaryDto> findActiveSummaries(Pageable pageable);
}
