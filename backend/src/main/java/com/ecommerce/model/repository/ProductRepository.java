package com.ecommerce.model.repository;
import com.ecommerce.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public class ProductRepository {
    private final JdbcTemplate jdbc;
    public ProductRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    private final RowMapper<Product> productMapper = (rs, rowNum) -> {
        Product p = new Product();
        p.setId(rs.getLong("id"));
        p.setName(rs.getString("name"));
        p.setDescription(rs.getString("description"));
        p.setPrice(rs.getBigDecimal("price")); // BigDecimal for DECIMAL col
        p.setStock(rs.getInt("stock"));
        p.setImageUrl(rs.getString("image_url"));
        p.setCategoryId(rs.getInt("category_id"));
        return p;
    };
    public List<Product> findAll(Integer categoryId) {
        if (categoryId != null) {
            return jdbc.query(
                    "SELECT * FROM products WHERE category_id = ? ORDER BY created_at DESC",
                    productMapper, categoryId);
        }
        return jdbc.query(
                "SELECT * FROM products ORDER BY created_at DESC", productMapper);
    }
    public List<Product> search(String keyword) {
        return jdbc.query(
                "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?",
                productMapper,
                "%" + keyword + "%",
                "%" + keyword + "%");
    }

    public Optional<Product> findById(Long id) {
        var results = jdbc.query(
                "SELECT * FROM products WHERE id = ?", productMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    public Long save(Product p) {
        jdbc.update(
                "INSERT INTO products (name,description,price,stock,image_url,category_id) "
                        + "VALUES (?,?,?,?,?,?)",
                p.getName(), p.getDescription(), p.getPrice(),
                p.getStock(), p.getImageUrl(), p.getCategoryId());
        return jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    }
    public void update(Long id, Product p) {
        jdbc.update(
                "UPDATE products SET name=?,description=?,price=?,stock=?,image_url=? "
                        + "WHERE id=?",
                p.getName(), p.getDescription(), p.getPrice(),
                p.getStock(), p.getImageUrl(), id);
    }
    public void delete(Long id) {
        jdbc.update("DELETE FROM products WHERE id = ?", id);
    }
    // Called by OrderService during order placement to reduce stock
    public void decrementStock(Long productId, int quantity) {
        jdbc.update(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                quantity, productId);
    }
}
