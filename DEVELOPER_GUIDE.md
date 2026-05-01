## Developer Guide — Sneaker PIM Service

This document is a practical onboarding guide for engineers working on the Sneaker Product Information Management (PIM) service.

---

## 1 Architecture Overview

### Modular Monolith by Domain
This codebase is a **Modular Monolith** organized by business domain under `src/modules/`:

- **Auth**: `src/modules/auth/` (register/login, token issuance)
- **User**: `src/modules/user/` (user persistence and password hashing)
- **Master Data**: `src/modules/master-data/` (brands, categories, colors, sizes)
- **Product**: `src/modules/product/` (products, variants, SKUs creation/read)
- **Inventory**: `src/modules/inventory/` (stock management for existing SKUs)

This layout keeps boundaries clear today, while making it straightforward to **extract a domain into a microservice later** (controllers/services/repositories/entities stay cohesive within the module).

### Data Access Layer (TypeScript + Sequelize)
Persistence is implemented with **TypeScript** and **Sequelize ORM** via:
- `sequelize`
- `sequelize-typescript`
- `@nestjs/sequelize`

Entities live in each domain (e.g. `src/modules/product/entites/*.entity.ts`), and data access is performed through dedicated repository classes (e.g. `src/modules/product/repositories/`, `src/modules/inventory/repositories/`). This enforces separation of concerns between HTTP, business logic, and persistence.

---

## 2 System Behaviors (Statelessness)

### The API is Stateless
The API is intentionally **stateless**:
- No user session state is stored in server memory.
- Requests are authenticated using **JWT Bearer tokens**.
- The server can be horizontally scaled behind a load balancer without sticky sessions.

### JWT Authentication
Authentication uses:
- `@nestjs/passport` + Passport JWT strategy
- `@nestjs/jwt` for signing tokens

Protected routes are guarded with `JwtAuthGuard` and Swagger supports JWT input via **BearerAuth**.

### Swagger is Dynamically Generated
Swagger documentation is generated at runtime using NestJS Swagger tooling and the **NestJS Swagger CLI plugin**, which introspects TypeScript types and `class-validator` constraints to produce clean docs without polluting DTOs.

---

## 3 Local Environment Setup

### Prerequisites
- Node.js + npm
- Docker Desktop (recommended)

### Start PostgreSQL (Docker Compose)

```bash
docker compose up -d
```

### Install dependencies

```bash
npm install
```

### Start NestJS (dev mode)

```bash
# Optional: align with docs URL below
export PORT=8080

npm run start:dev
```

### Swagger UI
Swagger UI is served at:
- `http://localhost:8080/api-docs`

If you do not set `PORT`, the service will use its configured default port; adjust the URL accordingly.

### Apple Silicon (ARM64) note
This repo is designed to work well on **Apple Silicon (ARM64)**:
- Prefer Docker images that support `linux/arm64`.
- If you run into architecture-related issues, ensure your Docker Compose services are using ARM64-compatible images and avoid forcing `linux/amd64` unless necessary.

---

## 4 Clean Code Standards (Strict Rules)

### Controllers & DTOs
- **DTOs must use `class-validator` / `class-transformer`** for validation and transformation.
- **`@ApiProperty()` in DTOs is strictly forbidden.**
  - Swagger documentation is generated via the **`@nestjs/swagger` CLI plugin** (configured in `nest-cli.json`).
  - Keep DTOs focused on validation and type shape only.

### Responses
- Controllers must return **raw data** (entities or DTO-shaped objects).
- **Do not manually wrap responses** in controllers.
  - Response shaping is handled globally by `TransformInterceptor`.
  - Error output is standardized globally by `GlobalExceptionFilter`.

This ensures consistency, reduces repeated code, and keeps controller logic thin and readable.

