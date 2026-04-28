package com.ecommerce;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// @SpringBootApplication = @Configuration + @EnableAutoConfiguration
// + @ComponentScan (all three in one annotation)
@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        // Starts embedded Tomcat on port 8080
        // Scans all @Component, @Service, @Repository, @Controller beans
        SpringApplication.run(EcommerceApplication.class, args);
    }
}