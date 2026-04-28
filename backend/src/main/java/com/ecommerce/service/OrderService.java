package com.ecommerce.service;
import com.ecommerce.model.*;
import com.ecommerce.model.repository.CartRepository;
import com.ecommerce.model.repository.OrderRepository;
import com.ecommerce.model.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
@Service
public class OrderService {
    private final CartRepository cartRepo;
    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    public OrderService(CartRepository c, OrderRepository o,
                        ProductRepository p) {
        this.cartRepo = c;
        this.orderRepo = o;
        this.productRepo = p;
    }
    // @Transactional: if ANY exception is thrown, ALL DB changes roll back
    // This is the most important annotation for data-integrity operations
    @Transactional
    public Long placeOrder(Long userId, String shippingAddress) {
        List<CartItem> cartItems = cartRepo.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        // Validate stock and calculate total
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found: "
                                    + item.getProductId()));
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for: " + product.getName());
            }
            total = total.add(

            item.getPrice().multiply(
                    BigDecimal.valueOf(item.getQuantity())));
        }
        // Create the order record
        Long orderId = orderRepo.createOrder(userId, total, shippingAddress);
        // Insert order items + deduct stock
        for (CartItem item : cartItems) {
            orderRepo.addOrderItem(
                    orderId, item.getProductId(),
                    item.getQuantity(), item.getPrice());
            productRepo.decrementStock(
                    item.getProductId(), item.getQuantity());
        }
        // Clear cart after successful order
        cartRepo.clearCart(userId);
        return orderId;
    }
    public List<Order> getUserOrders(Long userId) {
        return orderRepo.findByUserId(userId);
    }

    public Map<String, Object> getOrderDetails(Long orderId, Long userId) {
        List<Order> orders = orderRepo.findByUserId(userId);
        Order order = orders.stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found or access denied"));

        List<Map<String, Object>> items = orderRepo.findOrderItemsByOrderId(orderId, userId);
        
        return Map.of(
            "order", order,
            "items", items
        );
    }
}

