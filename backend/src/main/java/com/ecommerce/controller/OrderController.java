package com.ecommerce.controller;
import com.ecommerce.model.Order;
import com.ecommerce.model.repository.UserRepository;
import com.ecommerce.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(OrderService orderService,
                           UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // POST /api/orders body: { "shippingAddress": "123 Main St" }
    @PostMapping
    public ResponseEntity<String> placeOrder(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        Long orderId = orderService.placeOrder(
                getUserId(auth), body.get("shippingAddress"));
        return ResponseEntity.status(201)
                .body("Order placed successfully. ID: " + orderId);
    }

    // GET /api/orders — order history for logged-in user
    @GetMapping
    public ResponseEntity<List<Order>> getOrders(Authentication auth) {
        return ResponseEntity.ok(
                orderService.getUserOrders(getUserId(auth)));
    }

    // GET /api/orders/{orderId} — get specific order details
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderDetails(
            @PathVariable Long orderId,
            Authentication auth) {
        return ResponseEntity.ok(
                orderService.getOrderDetails(orderId, getUserId(auth)));
    }
}
