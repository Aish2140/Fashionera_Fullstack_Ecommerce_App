package com.ecommerce.model;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price; // BigDecimal — NEVER Double for money
    private int stock;
    private String imageUrl;
    private Integer categoryId;


}

