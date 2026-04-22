package com.pharma.backend.controller;

import com.pharma.backend.dto.ProductSummaryDto;
import com.pharma.backend.entity.Product;
import com.pharma.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products?page=0&size=12
    @GetMapping
    public ResponseEntity<Page<ProductSummaryDto>> getActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(productService.getActiveProducts(page, size));
    }

    // GET /api/products/{id} — vẫn trả đầy đủ, kể cả productDescription
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
