package com.ecommerce.model;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class CartItem {
    private Long id;
    private Long userId;
    private Long productId;
    private int quantity;
    // Fields joined from products table (for display in cart)
    private String productName;
    private BigDecimal price;
    private String imageUrl;
}
