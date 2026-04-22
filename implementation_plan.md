# Kế hoạch thực hiện — Pharmacy Web App
> Cập nhật lần cuối: 22/04/2026 — Phản ánh đúng code đã được implement

---

# 🧑‍💻 PHẦN 1: BACKEND (Hoàng)

## ✅ Phase 1 — Authentication (JWT) — ĐÃ HOÀN THÀNH

### Dependencies đã thêm vào `pom.xml`
- `spring-boot-starter-security`
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (version **0.12.6**)

### Config đã thêm vào `application.properties`
```properties
app.jwt.secret=${JWT_SECRET:pharmacySecretKey2024VeryLongAndSecure12345}
app.jwt.expiration=86400000
```

### Các file đã tạo mới

| File | Mô tả |
|------|-------|
| `entity/User.java` | Map bảng `users`, implement `UserDetails` |
| `repository/UserRepository.java` | `findByEmail()`, `existsByEmail()` |
| `dto/RegisterRequest.java` | name, email, password, phoneNumber |
| `dto/LoginRequest.java` | email, password |
| `dto/AuthResponse.java` | token, email, name, userId, role |
| `security/JwtUtil.java` | generateToken, extractEmail, isTokenValid |
| `security/JwtAuthFilter.java` | Đọc header Bearer token, set SecurityContext |
| `security/CustomUserDetailsService.java` | Tách riêng khỏi SecurityConfig để phá circular dependency |
| `security/SecurityConfig.java` | CORS + whitelist + filter chain |
| `service/AuthService.java` | register() (BCrypt), login() (JWT) |
| `controller/AuthController.java` | POST /register, POST /login, GET /me |

### Các file đã sửa

| File | Sửa gì |
|------|--------|
| `config/CorsConfig.java` | Xoá bean cũ — CORS do `SecurityConfig` xử lý |
| `config/WebConfig.java` | Xoá `@Configuration` — tránh xung đột CORS với Security |

### Endpoints

```
POST /api/auth/register   ← public
POST /api/auth/login      ← public
GET  /api/auth/me         ← cần token
```

---

## ✅ Phase 1.5 — Phân trang sản phẩm — ĐÃ HOÀN THÀNH

> Thực hiện song song với Phase 1 để tối ưu hiệu năng.

### Các file đã tạo mới

| File | Mô tả |
|------|-------|
| `dto/ProductSummaryDto.java` | DTO nhẹ cho danh sách — **không có** `productDescription` (HTML nặng) |

### Các file đã sửa

| File | Sửa gì |
|------|--------|
| `repository/ProductRepository.java` | Thêm JPQL `findActiveSummaries(Pageable)` — chỉ SELECT cột cần thiết |
| `service/ProductService.java` | `getActiveProducts(page, size)` trả `Page<ProductSummaryDto>` |
| `controller/ProductController.java` | Nhận `?page=0&size=12`, trả `Page<ProductSummaryDto>` |

### Endpoint đã cập nhật

```
GET /api/products?page=0&size=12   ← public, phân trang
GET /api/products/{id}             ← public, trả đầy đủ kể cả productDescription
```

---

## ✅ Phase 2 — Category/Brand + Filter sản phẩm — ĐÃ HOÀN THÀNH

### Các file đã tạo mới

| File | Mô tả |
|------|-------|
| `entity/Category.java` | Map bảng `categories` |
| `entity/Brand.java` | Map bảng `brands` |
| `entity/ProductCategory.java` | Map bảng `product_categories` |
| `entity/ProductBrand.java` | Map bảng `product_brands` |
| `repository/CategoryRepository.java` | `findByActiveTrue()` |
| `repository/BrandRepository.java` | `findByActiveTrue()` |
| `controller/CategoryController.java` | GET /api/categories |
| `controller/BrandController.java` | GET /api/brands |

### Các file đã sửa

| File | Sửa gì |
|------|--------|
| `repository/ProductRepository.java` | Thêm query filter theo keyword + categoryId + brandId |
| `service/ProductService.java` | Thêm `getFilteredProducts(keyword, categoryId, brandId, page, size)` |
| `controller/ProductController.java` | Thêm query params: `keyword`, `categoryId`, `brandId` |

### Endpoints đã tạo

```
GET /api/categories                                          ← public, mới
GET /api/brands                                              ← public, mới
GET /api/products?keyword=&categoryId=&brandId=&page=&size=  ← public, nâng cấp
```

---

## ✅ Phase 3 — Lịch sử đơn hàng — ĐÃ HOÀN THÀNH

### Các file đã tạo mới

| File | Mô tả |
|------|-------|
| `dto/OrderItemResponse.java` | productId, productName, price, quantity, subtotal |
| `dto/OrderSummaryResponse.java` | DTO nhẹ cho **danh sách** — id, status, paymentMethod, paymentStatus, createdAt, totalAmount, **itemCount** (không có items) |
| `dto/OrderResponse.java` | DTO đầy đủ cho **chi tiết** — thêm `List<OrderItemResponse> items` |

### Các file đã sửa

| File | Sửa gì |
|------|--------|
| `dto/OrderRequest.java` | **Bỏ `userId`** — backend tự lấy từ JWT token |
| `repository/OrderRepository.java` | Thêm `findByUserIdOrderByCreatedAtDesc()`, `findByIdAndUserId()` |
| `repository/OrderItemRepository.java` | Thêm `findByOrderId()` |
| `service/OrderService.java` | `createOrder` lấy userId từ SecurityContext; thêm `getMyOrders()`, `getOrderById()` |
| `controller/OrderController.java` | Thêm `GET /api/orders/my`, `GET /api/orders/{id}` |

### Endpoints

```
POST /api/orders          ← cần token; body KHÔNG có userId
GET  /api/orders/my       ← cần token; trả List<OrderSummaryResponse> (không có items)
GET  /api/orders/{id}     ← cần token; trả OrderResponse đầy đủ có items
```

### Response format

**POST /api/orders** và **GET /api/orders/my** → `OrderSummaryResponse`:
```json
{
  "id": 93,
  "status": "pending",
  "paymentMethod": "cash",
  "paymentStatus": "unpaid",
  "createdAt": "2026-04-22T13:37:29",
  "totalAmount": 100000,
  "itemCount": 1
}
```

**GET /api/orders/{id}** → `OrderResponse` (có items):
```json
{
  "id": 93,
  "status": "pending",
  "paymentMethod": "cash",
  "paymentStatus": "unpaid",
  "createdAt": "2026-04-22T13:37:29",
  "totalAmount": 100000,
  "items": [
    { "productId": 1, "productName": "Viên nén Decolgen...", "price": 50000, "quantity": 2, "subtotal": 100000 }
  ]
}
```

---
---

# 👨‍💻 PHẦN 2: FRONTEND (An)

## ✅ Phase 1 — Authentication (JWT)

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `context/AuthContext.tsx` | React Context lưu user, token, isAuthenticated; actions: login(), logout() |
| `components/ProtectedRoute.tsx` | Nếu chưa login → redirect `/login` |
| `pages/Login.tsx` | Form email + password → gọi API → lưu token → về trang chủ |
| `pages/Register.tsx` | Form name + email + password + phoneNumber |

### Các file cần sửa

| File | Sửa gì |
|------|--------|
| `services/api.ts` | Thêm axios interceptor tự gắn `Authorization: Bearer <token>`; thêm `authService` |
| `App.tsx` | Thêm routes `/login`, `/register`, `/my-orders`; wrap bằng `<AuthProvider>` |
| `components/Layout.tsx` | Header: chưa login → nút Đăng nhập/Đăng ký; đã login → tên + Đơn hàng + Đăng xuất |
| `pages/Cart.tsx` | Xoá ô nhập userId thủ công; **bỏ `userId` khỏi payload khi POST /api/orders** |

### API cần gọi

```
POST /api/auth/register   body: { name, email, password, phoneNumber }
POST /api/auth/login      body: { email, password }
GET  /api/auth/me         header: Authorization: Bearer <token>
```

### Response mẫu
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "a@gmail.com",
  "name": "Nguyen Van A",
  "userId": 1,
  "role": "client"
}
```
→ Lưu token: `localStorage.setItem('token', token)`

---

## ✅ Phase 1.5 — Cập nhật Product API (phân trang)

> Backend đã đổi response từ `Array` sang `Page object`. An cần cập nhật cách đọc data.

### Thay đổi bắt buộc

| File | Sửa gì |
|------|--------|
| `types/index.ts` | Thêm `PageResponse<T>`, `ProductSummary` (không có `productDescription`) |
| `services/api.ts` | `getProducts(page, size)` trả `PageResponse<ProductSummary>` |
| `pages/Home.tsx` | Đọc `response.data.content` thay vì `response.data`; thêm state `page`; render nút phân trang |

### Response mới của `GET /api/products`
```json
{
  "content": [ { "id": 1, "productName": "...", "buyingPrice": 50000, "shortDescription": "...", "active": true } ],
  "totalElements": 150,
  "totalPages": 13,
  "number": 0,
  "size": 12,
  "first": true,
  "last": false
}
```
> ⚠️ **Quan trọng:** `productDescription` KHÔNG còn trong response danh sách. Chỉ có ở `GET /api/products/{id}`.

---

## ⬜ Phase 2 — Category/Brand + Filter — CHƯA LÀM (chờ backend Phase 2)

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `services/categoryService.ts` | `getCategories()`, `getBrands()` |

### Các file cần sửa

| File | Sửa gì |
|------|--------|
| `types/index.ts` | Thêm `Category`, `Brand` |
| `services/api.ts` | `getProducts()` nhận thêm params: `keyword`, `categoryId`, `brandId` |
| `pages/Home.tsx` | Thêm state filter; sidebar lọc; debounce 500ms ô tìm kiếm |

---

## ✅ Phase 3 — Lịch sử đơn hàng

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `pages/OrderHistory.tsx` | Gọi `GET /api/orders/my` → danh sách đơn với badge trạng thái + tổng tiền + số lượng loại sp |
| `pages/OrderDetail.tsx` | Gọi `GET /api/orders/{id}` → chi tiết đơn + bảng sản phẩm |

### Các file cần sửa

| File | Sửa gì |
|------|--------|
| `types/index.ts` | Thêm `OrderSummaryResponse`, `OrderResponse`, `OrderItemResponse` |
| `services/api.ts` | Thêm `getMyOrders()`, `getOrderById(id)` |
| `pages/Cart.tsx` | **Bỏ `userId` khỏi payload** khi gọi `POST /api/orders` |

### API cần gọi

```
POST /api/orders         body: { paymentMethod, orderItems }  ← không có userId!
GET  /api/orders/my      ← token tự động qua interceptor
GET  /api/orders/{id}    ← token tự động qua interceptor
```

### Response `GET /api/orders/my` → `OrderSummaryResponse[]`
```json
[
  {
    "id": 93,
    "status": "pending",
    "paymentMethod": "cash",
    "paymentStatus": "unpaid",
    "createdAt": "2026-04-22T13:37:29",
    "totalAmount": 100000,
    "itemCount": 1
  }
]
```
> ⚠️ **Không có `items`** trong response danh sách. Muốn xem chi tiết → gọi `GET /api/orders/{id}`.

### Response `GET /api/orders/{id}` → `OrderResponse`
```json
{
  "id": 93,
  "status": "pending",
  "paymentMethod": "cash",
  "paymentStatus": "unpaid",
  "createdAt": "2026-04-22T13:37:29",
  "totalAmount": 100000,
  "items": [
    { "productId": 1, "productName": "Viên nén Decolgen...", "price": 50000, "quantity": 2, "subtotal": 100000 }
  ]
}
```

---

## ✅ Checklist Backend (Hoàng)

### Phase 1 + 1.5
- [x] Thêm dependencies vào `pom.xml`
- [x] Thêm config JWT vào `application.properties`
- [x] Tạo `User` entity + `UserRepository`
- [x] Tạo 3 DTO: `RegisterRequest`, `LoginRequest`, `AuthResponse`
- [x] Tạo `JwtUtil` + `JwtAuthFilter` + `CustomUserDetailsService`
- [x] Tạo `SecurityConfig` (CORS + filter chain)
- [x] Dọn `CorsConfig.java` + `WebConfig.java`
- [x] Tạo `AuthService` + `AuthController`
- [x] Tạo `ProductSummaryDto`; cập nhật `ProductRepository`, `ProductService`, `ProductController` — phân trang
- [x] Test Postman: register ✅ login ✅ me ✅ products ✅

### Phase 3
- [x] Tạo `OrderItemResponse`, `OrderSummaryResponse`, `OrderResponse`
- [x] Cập nhật `OrderRepository` + `OrderItemRepository`
- [x] Viết lại `OrderService` (userId từ JWT, getMyOrders, getOrderById)
- [x] Viết lại `OrderController` (thêm 2 endpoints)
- [x] Bỏ `userId` khỏi `OrderRequest`
- [x] Test Postman: POST order ✅ GET my ✅ GET /{id} ✅

### Phase 2 — Category/Brand + Filter
- [x] Tạo `Category`, `Brand`, `ProductCategory`, `ProductBrand` entity
- [x] Tạo `CategoryRepository`, `BrandRepository`, `CategoryController`, `BrandController`
- [x] Cập nhật `ProductRepository` thêm `findWithFilters`
- [x] Cập nhật `ProductService` + `ProductController` nhận keyword/categoryId/brandId

---

## ✅ Checklist Frontend (An)

### Phase 1 + 1.5
- [ ] Tạo `AuthContext.tsx`
- [ ] Tạo `ProtectedRoute.tsx`
- [ ] Tạo `Login.tsx` + `Register.tsx`
- [ ] Thêm axios interceptor + `authService` vào `api.ts`
- [ ] Cập nhật `App.tsx` (routes + AuthProvider)
- [ ] Cập nhật `Layout.tsx` (header login/logout)
- [ ] Thêm `PageResponse<T>`, `ProductSummary` vào `types/index.ts`
- [ ] Cập nhật `api.ts`: `getProducts(page, size)` trả `PageResponse`
- [ ] Cập nhật `Home.tsx`: đọc `response.data.content`, thêm phân trang

### Phase 3
- [ ] Thêm types `OrderSummaryResponse`, `OrderResponse`, `OrderItemResponse`
- [ ] Thêm `getMyOrders()`, `getOrderById()` vào `api.ts`
- [ ] Tạo `OrderHistory.tsx`
- [ ] Tạo `OrderDetail.tsx`
- [ ] Cập nhật `Cart.tsx` (bỏ `userId` khỏi payload)

### Phase 2 — Chờ backend hoàn thành Phase 2
- [ ] Thêm types `Category`, `Brand`
- [ ] Tạo `categoryService.ts`
- [ ] Cập nhật `Home.tsx` (sidebar lọc + search debounce)
