# Ecommerce Application Architecture and UML Diagrams

This document provides architecture and UML diagrams for the Ecommerce project.
All diagrams are written in Mermaid so they render directly in Markdown viewers that support Mermaid.

## 1) System Context Diagram

```mermaid
flowchart LR
    U[Customer / Admin User]
    B[Browser SPA\nReact + Vite]
    API[Backend API\nSpring Boot 3.5\nJava 21]
    DB[(MySQL\necommerce_db)]

    U -->|Uses| B
    B -->|HTTPS/HTTP JSON\n/api/*| API
    API -->|JDBC| DB
```

## 2) C4-Style Container Diagram

```mermaid
flowchart TB
    subgraph Client[Client Layer]
        SPA[Frontend SPA\nReact Router\nAuthContext\nCartContext\nAxios Interceptors]
    end

    subgraph Server[Application Layer]
        CTRL[Controllers\nAuth, Product, Cart, Order]
        SRV[Services\nAuthService, OrderService]
        SEC[Security\nSecurityConfig + JwtAuthFilter + JwtUtil]
        REPO[Repositories\nUser/Product/Cart/Order\n(JdbcTemplate)]
    end

    subgraph Data[Data Layer]
        MYSQL[(MySQL)]
        T1[(users)]
        T2[(products)]
        T3[(cart_items)]
        T4[(orders)]
        T5[(order_items)]
    end

    SPA --> CTRL
    CTRL --> SRV
    CTRL --> REPO
    SRV --> REPO
    CTRL --> SEC
    SRV --> SEC
    REPO --> MYSQL

    MYSQL --- T1
    MYSQL --- T2
    MYSQL --- T3
    MYSQL --- T4
    MYSQL --- T5
```

## 3) Backend Component Diagram

```mermaid
classDiagram
    class AuthController {
      +register(RegisterRequest) ResponseEntity~AuthResponse~
      +login(LoginRequest) ResponseEntity~AuthResponse~
    }

    class ProductController {
      +getAll(Integer) ResponseEntity~List~
      +search(String) ResponseEntity~List~
      +getOne(Long) ResponseEntity~Product~
      +create(Product) ResponseEntity~String~
      +update(Long, Product) ResponseEntity~String~
      +delete(Long) ResponseEntity~String~
    }

    class CartController {
      +getCart(Authentication) ResponseEntity~List~
      +addToCart(Map, Authentication) ResponseEntity~String~
      +updateQuantity(Long, Map, Authentication) ResponseEntity~String~
      +removeItem(Long, Authentication) ResponseEntity~String~
    }

    class OrderController {
      +placeOrder(Map, Authentication) ResponseEntity~String~
      +getOrders(Authentication) ResponseEntity~List~
      +getOrderDetails(Long, Authentication) ResponseEntity~Map~
    }

    class AuthService {
      +register(RegisterRequest) AuthResponse
      +login(LoginRequest) AuthResponse
    }

    class OrderService {
      +placeOrder(Long, String) Long
      +getUserOrders(Long) List~Order~
      +getOrderDetails(Long, Long) Map~String,Object~
    }

    class JwtAuthFilter
    class JwtUtil
    class SecurityConfig

    class UserRepository
    class ProductRepository
    class CartRepository
    class OrderRepository

    AuthController --> AuthService
    OrderController --> OrderService
    ProductController --> ProductRepository
    CartController --> CartRepository
    CartController --> UserRepository
    OrderController --> UserRepository

    AuthService --> UserRepository
    AuthService --> JwtUtil

    OrderService --> CartRepository
    OrderService --> OrderRepository
    OrderService --> ProductRepository

    SecurityConfig --> JwtAuthFilter
    JwtAuthFilter --> JwtUtil
```

## 4) Domain Class Diagram (Entity Model)

```mermaid
classDiagram
    class User {
      +Long id
      +String name
      +String email
      +String password
      +String role
    }

    class Product {
      +Long id
      +String name
      +String description
      +BigDecimal price
      +int stock
      +String imageUrl
      +Integer categoryId
    }

    class CartItem {
      +Long id
      +Long userId
      +Long productId
      +int quantity
      +String productName
      +BigDecimal price
      +String imageUrl
    }

    class Order {
      +Long id
      +Long userId
      +BigDecimal totalAmount
      +String status
      +String shippingAddress
      +LocalDateTime placedAt
      +int itemCount
    }

    class OrderItem {
      +Long id
      +Long orderId
      +Long productId
      +int quantity
      +BigDecimal unitPrice
    }

    User "1" --> "0..*" CartItem : owns
    User "1" --> "0..*" Order : places
    Product "1" --> "0..*" CartItem : appears in
    Order "1" --> "1..*" OrderItem : contains
    Product "1" --> "0..*" OrderItem : purchased as
```

## 5) Database ER Diagram

```mermaid
erDiagram
    USERS ||--o{ CART_ITEMS : has
    USERS ||--o{ ORDERS : places
    PRODUCTS ||--o{ CART_ITEMS : referenced_by
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : referenced_by

    USERS {
      BIGINT id PK
      VARCHAR name
      VARCHAR email UK
      VARCHAR password
      VARCHAR role
    }

    PRODUCTS {
      BIGINT id PK
      VARCHAR name
      TEXT description
      DECIMAL price
      INT stock
      VARCHAR image_url
      INT category_id
    }

    CART_ITEMS {
      BIGINT id PK
      BIGINT user_id FK
      BIGINT product_id FK
      INT quantity
    }

    ORDERS {
      BIGINT id PK
      BIGINT user_id FK
      DECIMAL total_amount
      VARCHAR status
      VARCHAR shipping_address
      DATETIME placed_at
    }

    ORDER_ITEMS {
      BIGINT id PK
      BIGINT order_id FK
      BIGINT product_id FK
      INT quantity
      DECIMAL unit_price
    }
```

## 6) Authentication Sequence Diagram (Login)

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant FE as React Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant UR as UserRepository
    participant JU as JwtUtil
    participant DB as MySQL

    User->>FE: Submit email/password
    FE->>AC: POST /api/auth/login
    AC->>AS: login(request)
    AS->>UR: findByEmail(email)
    UR->>DB: SELECT * FROM users WHERE email=?
    DB-->>UR: User row
    UR-->>AS: User
    AS->>AS: BCrypt matches(password)
    AS->>JU: generateToken(userId,email,role)
    JU-->>AS: JWT
    AS-->>AC: AuthResponse(token,user)
    AC-->>FE: 200 OK + token
    FE->>FE: Save token in localStorage
```

## 7) Order Placement Sequence Diagram (Checkout)

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant FE as CheckoutPage
    participant API as OrderController
    participant OS as OrderService
    participant CR as CartRepository
    participant PR as ProductRepository
    participant OR as OrderRepository
    participant DB as MySQL

    User->>FE: Place Order (shippingAddress)
    FE->>API: POST /api/orders (Bearer JWT)
    API->>OS: placeOrder(userId, shippingAddress)
    OS->>CR: findByUserId(userId)
    CR->>DB: SELECT cart + product join
    DB-->>CR: cartItems
    CR-->>OS: cartItems

    loop for each cart item
      OS->>PR: findById(productId)
      PR->>DB: SELECT product
      DB-->>PR: product row
      PR-->>OS: Product
      OS->>OS: validate stock + total += price*qty
    end

    OS->>OR: createOrder(userId,total,address)
    OR->>DB: INSERT orders
    DB-->>OR: orderId
    OR-->>OS: orderId

    loop for each cart item
      OS->>OR: addOrderItem(orderId, productId, qty, unitPrice)
      OR->>DB: INSERT order_items
      OS->>PR: decrementStock(productId, qty)
      PR->>DB: UPDATE products set stock = stock - qty
    end

    OS->>CR: clearCart(userId)
    CR->>DB: DELETE FROM cart_items WHERE user_id=?
    OS-->>API: orderId
    API-->>FE: 201 Created
    FE-->>User: Show success + order id
```

## 8) Activity Diagram (User Journey)

```mermaid
flowchart TD
    A[Open App] --> B[Browse products]
    B --> C{Logged in?}
    C -- No --> D[Register or Login]
    D --> E[Receive JWT]
    E --> F[Store token in localStorage]
    C -- Yes --> G[Add items to cart]
    F --> G
    G --> H[Adjust quantity]
    H --> I[Go to checkout]
    I --> J[Submit shipping address]
    J --> K[Create order]
    K --> L[Deduct stock + clear cart]
    L --> M[View orders]
    M --> N[View order details]
```

## 9) Security Flow Diagram (JWT Request Lifecycle)

```mermaid
flowchart LR
    Req[Incoming HTTP Request] --> H{Authorization header Bearer token?}
    H -- No --> A1[Continue filter chain as anonymous]
    H -- Yes --> V[JwtUtil.validateToken]
    V -- Invalid --> A1
    V -- Valid --> X[Extract email + role]
    X --> Y[Create UsernamePasswordAuthenticationToken]
    Y --> Z[Set SecurityContext authentication]
    Z --> C[Controller method executes]
```

## 10) Deployment Diagram (Local Dev)

```mermaid
flowchart TB
    subgraph DevMachine[Developer Machine]
      Browser[Browser\nlocalhost:5173]
      Vite[Vite Dev Server\nReact App]
      Spring[Spring Boot App\nlocalhost:8080]
      Mysql[(MySQL Server\nlocalhost:3306)]
    end

    Browser <--> Vite
    Vite -->|REST /api/*| Spring
    Spring -->|JDBC| Mysql
```

## 11) Frontend Route Map Diagram

```mermaid
flowchart LR
    ROOT[/ /] --> HOME[HomePage]
    ROOT --> PRODUCTS[/products/]
    ROOT --> PRODUCT_ID[/products/:id/]
    ROOT --> LOGIN[/login/]
    ROOT --> REGISTER[/register/]

    ROOT --> CART[/cart/ (Protected)]
    ROOT --> CHECKOUT[/checkout/ (Protected)]
    ROOT --> ORDERS[/orders/ (Protected)]
    ROOT --> ORDER_ID[/orders/:id/ (Protected)]
```

## 12) UML Use Case Diagram

```mermaid
flowchart LR
    actor1([Customer])
    actor2([Admin])

    subgraph EcommerceSystem[Ecommerce System]
      UC1((Register))
      UC2((Login))
      UC3((Browse Products))
      UC4((View Product Details))
      UC5((Manage Cart))
      UC6((Checkout / Place Order))
      UC7((View Orders))
      UC8((View Order Detail))
      UC9((Create Product))
      UC10((Update Product))
      UC11((Delete Product))
    end

    actor1 --> UC1
    actor1 --> UC2
    actor1 --> UC3
    actor1 --> UC4
    actor1 --> UC5
    actor1 --> UC6
    actor1 --> UC7
    actor1 --> UC8

    actor2 --> UC3
    actor2 --> UC4
    actor2 --> UC9
    actor2 --> UC10
    actor2 --> UC11
```

## 13) Suggested Diagram Usage

- Use sections 1-2 for architecture overview slides.
- Use sections 3-5 for technical design and data model documentation.
- Use sections 6-9 for API behavior and security explanation.
- Use sections 10-11 for deployment and frontend navigation walkthrough.

