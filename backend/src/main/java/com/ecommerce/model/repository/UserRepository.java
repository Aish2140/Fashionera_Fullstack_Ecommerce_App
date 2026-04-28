package com.ecommerce.model.repository;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.User;
@Repository
public class UserRepository {
    private final JdbcTemplate jdbc;
    // Constructor injection — preferred over @Autowired field injection
    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }
    // RowMapper converts each ResultSet row into a User object
    private final RowMapper<User> userMapper = (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setRole(rs.getString("role"));
        return user;
    };
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        // ? = parameterised placeholder — prevents SQL injection
        var results = jdbc.query(sql, userMapper, email);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }
    public Long save(String name, String email, String hashedPassword) {
        jdbc.update(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                name, email, hashedPassword, "CUSTOMER");
        return jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    }
}
