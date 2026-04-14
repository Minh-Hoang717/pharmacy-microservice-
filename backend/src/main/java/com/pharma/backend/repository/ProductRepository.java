package com.pharma.backend.repository;

import com.pharma.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Custom method to get list of products where active = true (1)
    List<Product> findByActiveTrue();
}
