package com.ecommerce.controller;
import com.ecommerce.model.Product;
import com.ecommerce.model.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;
    public ProductController(ProductRepository repo) {
        this.productRepository = repo;
    }
    // GET /api/products OR GET /api/products?category=1
    @GetMapping
    public ResponseEntity<List<Product>> getAll(
            @RequestParam(required = false) Integer category) {
        return ResponseEntity.ok(productRepository.findAll(category));
    }
    // GET /api/products/search?q=phone
    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String q) {
        return ResponseEntity.ok(productRepository.search(q));
    }
    // GET /api/products/42
    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // POST /api/products — ADMIN ONLY
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> create(@RequestBody Product product) {
        Long id = productRepository.save(product);
        return ResponseEntity.status(201).body("Product created id: " + id);
    }
    // PUT /api/products/42 — ADMIN ONLY
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> update(
            @PathVariable Long id, @RequestBody Product product) {
        productRepository.update(id, product);
        return ResponseEntity.ok("Product updated");
    }
    // DELETE /api/products/42 — ADMIN ONLY
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        productRepository.delete(id);
        return ResponseEntity.ok("Product deleted");
    }
}
