package com.ecommerce.model;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class Order {
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private String status;
    private String shippingAddress;
    private LocalDateTime placedAt;
    private int itemCount; // computed field from JOIN
}


