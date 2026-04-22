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

    // Phân trang: mặc định 12 sản phẩm/trang, sắp xếp theo id giảm dần (mới nhất trước)
    public Page<ProductSummaryDto> getActiveProducts(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return productRepository.findActiveSummaries(pageable);
    }

    // Giữ lại cho ProductDetail — trả đầy đủ thông tin kể cả productDescription
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
}
