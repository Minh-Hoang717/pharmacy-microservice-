package com.pharma.backend.repository;

import com.pharma.backend.dto.ProductSummaryDto;
import com.pharma.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Lọc nâng cao: phân trang + keyword + category + brand
    @Query("""
            SELECT new com.pharma.backend.dto.ProductSummaryDto(
                p.id, p.slug, p.productName, p.buyingPrice, p.shortDescription, p.active
            )
            FROM Product p
            WHERE p.active = true
            AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:categoryId IS NULL OR EXISTS (SELECT 1 FROM ProductCategory pc WHERE pc.productId = p.id AND pc.categoryId = :categoryId))
            AND (:brandId IS NULL OR EXISTS (SELECT 1 FROM ProductBrand pb WHERE pb.productId = p.id AND pb.brandId = :brandId))
            """)
    Page<ProductSummaryDto> findWithFilters(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            Pageable pageable
    );
}
