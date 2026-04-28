# Ecommerce Application

A modern split-stack ecommerce application featuring a Spring Boot backend and a React/Vite frontend.

## Features

- **Product Catalog**: Browse and view detailed product information.
- **User Authentication**: Secure login and registration using JWT.
- **Shopping Cart**: Add, increase, decrease, or remove items from your cart across multiple pages.
- **Checkout Process**: Securely place orders and manage shipping information.
- **Order History & Details**: View past orders and click into specific orders to see detailed item lists, pricing, and status.

## Technologies Used

### Frontend
- React 18 + Vite
- React Router DOM for navigation
- Lucide React for iconography
- Context API for Auth and Cart state management
- Axios for API communication

### Backend
- Spring Boot 3.5.11
- Java 21
- Spring Security (Stateless JWT Authentication)
- Spring JDBC & MySQL Connector
- Lombok

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Configure your MySQL database settings in `src/main/resources/application.properties`.
3. Run the application using Maven: `./mvnw spring-boot:run`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## Recent Enhancements
- Added missing ability to decrease quantity in the cart.
- Enabled "View Details" button in the Orders page, linking to a newly added `OrderDetailPage` with full backend support for retrieving order items.
