# BookShoppingApp

A Spring Boot-based e-commerce backend for a book shopping application.

The project provides REST APIs for managing books, authors, customers, orders, users, addresses, and JWT-based authentication. It uses an in-memory H2 database, Spring Data JPA for persistence, Spring Security for authentication, and SpringDoc for API documentation.

## Features

- Book catalog management
- Author management
- Customer and address management
- Order creation and retrieval
- User registration and authentication via JWT
- Embedded H2 database with web console support
- API documentation via SpringDoc OpenAPI UI

## Tech Stack

- Java 17
- Spring Boot 2.7.5
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Validation
- H2 Database
- JSON Web Tokens (JJWT)
- SpringDoc OpenAPI
- Maven

## Getting Started

### Prerequisites

- Java 17 SDK
- Maven 3.x

### Build and Run

From the project root (`E-commerce-website`):

```bash
./mvnw clean package
./mvnw spring-boot:run
```

On Windows, use:

```powershell
mvnw.cmd clean package
mvnw.cmd spring-boot:run
```

The application starts on port `8888` by default.

### Accessing the Application

- API base URL: `http://localhost:8888`
- H2 console: `http://localhost:8888/h2db`
- OpenAPI UI: `http://localhost:8888/swagger-ui.html`

## Project Structure

- `src/main/java/com/company/demo` - application source code
  - `controller` - REST controllers for books, authors, customers, orders, users, addresses, and JWT
  - `entity` - JPA entities
  - `repository` - Spring Data JPA repositories
  - `service` / `serviceimpl` - business logic and implementations
  - `security` - JWT and authentication components
  - `exception` - custom exception types
  - `exceptionhandler` - API exception handling
  - `generator` - ID generation and initial data setup

- `src/main/resources` - configuration and static resources
  - `application.properties` - application configuration

## Database

The project uses H2 in-memory database configured at `jdbc:h2:mem:book`.

The database is initialized at startup with sample data, including one admin user and sample books with authors.

## Notes

- The H2 console is enabled for easy inspection and debugging.
- JWT authentication is used for secure endpoints.
- The application is intended as a demo/minor project backend.

## Contact

For questions or improvements, please refer to the source code and controllers in the `src/main/java/com/company/demo/controller` package.
