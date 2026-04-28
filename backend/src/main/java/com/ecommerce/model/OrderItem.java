package com.ecommerce.model;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class OrderItem {
    private Long id;
    private Long orderId;
    private Long productId;
    private int quantity;
    private BigDecimal unitPrice; // price at time of purchase (snapshot)
}


