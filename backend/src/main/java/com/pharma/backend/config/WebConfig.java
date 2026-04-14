package com.pharma.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Cho phép mọi endpoint
                .allowedOrigins("*") // Cho phép mọi origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Các method cho phép
                .allowedHeaders("*"); // Cho phép mọi header
    }
}
