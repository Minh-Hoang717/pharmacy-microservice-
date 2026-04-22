package com.pharma.backend.service;

import com.pharma.backend.dto.ProductSummaryDto;
import com.pharma.backend.entity.Product;
import com.pharma.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Phân trang và lọc: hỗ trợ keyword, categoryId, brandId
    public Page<ProductSummaryDto> getFilteredProducts(String keyword, Long categoryId, Long brandId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return productRepository.findWithFilters(keyword, categoryId, brandId, pageable);
    }

    // Giữ lại cho ProductDetail — trả đầy đủ thông tin kể cả productDescription
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
}
