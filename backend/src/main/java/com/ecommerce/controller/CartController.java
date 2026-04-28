package com.ecommerce.controller;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.repository.CartRepository;
import com.ecommerce.model.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    public CartController(CartRepository cartRepo, UserRepository userRepo) {
        this.cartRepository = cartRepo;
        this.userRepository = userRepo;
    }
    // Helper: extract userId from JWT via Authentication (set by JwtAuthFilter)
    private Long getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
    // GET /api/cart
    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication auth) {
        return ResponseEntity.ok(
                cartRepository.findByUserId(getUserId(auth)));
    }
    // POST /api/cart body: { "productId": 5, "quantity": 2 }
    @PostMapping
    public ResponseEntity<String> addToCart(
            @RequestBody Map<String, Integer> body,
            Authentication auth) {
        Long productId = Long.valueOf(body.get("productId"));
        int quantity = body.getOrDefault("quantity", 1);
        cartRepository.addItem(getUserId(auth), productId, quantity);

        return ResponseEntity.ok("Added to cart");
    }
    // PUT /api/cart/{itemId} body: { "quantity": 3 }
    @PutMapping("/{itemId}")
    public ResponseEntity<String> updateQuantity(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body,
            Authentication auth) {
        cartRepository.updateQuantity(
                itemId, getUserId(auth), body.get("quantity"));
        return ResponseEntity.ok("Quantity updated");
    }
    // DELETE /api/cart/{itemId}
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> removeItem(
            @PathVariable Long itemId,
            Authentication auth) {
        cartRepository.removeItem(itemId, getUserId(auth));
        return ResponseEntity.ok("Item removed");
    }
}

