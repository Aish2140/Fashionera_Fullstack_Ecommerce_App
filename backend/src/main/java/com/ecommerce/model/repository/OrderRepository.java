package com.ecommerce.model.repository;
import com.ecommerce.model.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
@Repository
public class OrderRepository {
    private final JdbcTemplate jdbc;
    public OrderRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public Long createOrder(Long userId, BigDecimal total, String address) {
        jdbc.update(
                "INSERT INTO orders (user_id, total_amount, shipping_address) "
                        + "VALUES (?, ?, ?)",
                userId, total, address);
        return jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    }
    public void addOrderItem(Long orderId, Long productId,
                             int quantity, BigDecimal unitPrice) {
        jdbc.update(
                "INSERT INTO order_items "
                        + "(order_id, product_id, quantity, unit_price) "
                        + "VALUES (?, ?, ?, ?)",
                orderId, productId, quantity, unitPrice);
    }
    public List<Order> findByUserId(Long userId) {
        String sql = "SELECT o.*, "
                + "(SELECT COUNT(*) FROM order_items WHERE order_id = o.id) "
                + " AS item_count "
                + "FROM orders o WHERE o.user_id = ? "
                + "ORDER BY o.placed_at DESC";
        return jdbc.query(sql, (rs, n) -> {
            Order o = new Order();
            o.setId(rs.getLong("id"));
            o.setTotalAmount(rs.getBigDecimal("total_amount"));
            o.setStatus(rs.getString("status"));
            o.setShippingAddress(rs.getString("shipping_address"));
            o.setPlacedAt(rs.getTimestamp("placed_at").toLocalDateTime());
            o.setItemCount(rs.getInt("item_count"));
            return o;
        }, userId);
    }
    public List<Map<String, Object>> findOrderItemsByOrderId(Long orderId, Long userId) {
        String sql = "SELECT oi.quantity, oi.unit_price, p.name as product_name, p.image_url " +
                     "FROM order_items oi " +
                     "JOIN products p ON oi.product_id = p.id " +
                     "JOIN orders o ON oi.order_id = o.id " +
                     "WHERE oi.order_id = ? AND o.user_id = ?";
        return jdbc.queryForList(sql, orderId, userId);
    }
}

