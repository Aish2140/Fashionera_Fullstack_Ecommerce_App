package com.ecommerce.model.repository;
import com.ecommerce.model.CartItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public class CartRepository {
    private final JdbcTemplate jdbc;
    public CartRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    // Get all cart items for a user, JOIN with products for names/prices
    public List<CartItem> findByUserId(Long userId) {
        String sql = "SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, "
                + "p.name AS product_name, p.price, p.image_url "
                + "FROM cart_items ci "
                + "JOIN products p ON ci.product_id = p.id "
                + "WHERE ci.user_id = ?";
        return jdbc.query(sql, (rs, n) -> {
            CartItem item = new CartItem();
            item.setId(rs.getLong("id"));
            item.setProductId(rs.getLong("product_id"));
            item.setQuantity(rs.getInt("quantity"));
            item.setProductName(rs.getString("product_name"));
            item.setPrice(rs.getBigDecimal("price"));
            item.setImageUrl(rs.getString("image_url"));
            return item;
        }, userId);
    }
    // Add item — if product already in cart, UPDATE quantity instead
    // INSERT ... ON DUPLICATE KEY UPDATE is MySQL-specific
    public void addItem(Long userId, Long productId, int quantity) {
        String sql = "INSERT INTO cart_items (user_id, product_id, quantity) "
                + "VALUES (?, ?, ?) "
                + "ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
        jdbc.update(sql, userId, productId, quantity);
    }
    // userId check prevents users from modifying others' cart items
    public void updateQuantity(Long cartItemId, Long userId, int quantity) {
        jdbc.update(
                "UPDATE cart_items SET quantity=? WHERE id=? AND user_id=?",
                quantity, cartItemId, userId);
    }
    public void removeItem(Long cartItemId, Long userId) {
        jdbc.update(
                "DELETE FROM cart_items WHERE id=? AND user_id=?",
                cartItemId, userId);
    }
    // Called after order is placed — empty the cart
    public void clearCart(Long userId) {
        jdbc.update("DELETE FROM cart_items WHERE user_id=?", userId);
    }
}

