# Kế hoạch thực hiện — Pharmacy Web App

---

# 🧑‍💻 PHẦN 1: BACKEND (Hoàng)

## Phase 1 — Authentication (JWT)

### Thêm dependencies vào `pom.xml`
- `spring-boot-starter-security`
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (version 0.12.6)

### Thêm vào `application.properties`
```properties
app.jwt.secret=${JWT_SECRET:pharmacySecretKey2024VeryLongAndSecure}
app.jwt.expiration=86400000
```

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `entity/User.java` | Map bảng `users`, implement `UserDetails` |
| `repository/UserRepository.java` | `findByEmail()`, `existsByEmail()` |
| `dto/RegisterRequest.java` | name, email, password, phoneNumber |
| `dto/LoginRequest.java` | email, password |
| `dto/AuthResponse.java` | token, email, name, userId, role |
| `security/JwtUtil.java` | generateToken, extractEmail, isTokenValid |
| `security/JwtAuthFilter.java` | Đọc header Bearer token, set SecurityContext |
| `security/SecurityConfig.java` | Cấu hình CORS + whitelist public endpoints + đăng ký JwtAuthFilter |
| `service/AuthService.java` | register() (BCrypt + lưu user), login() (xác thực + tạo JWT) |
| `controller/AuthController.java` | POST /api/auth/register, POST /api/auth/login, GET /api/auth/me |

### File cần sửa

| File | Sửa gì |
|------|--------|
| `config/CorsConfig.java` | Xoá bean cũ — để SecurityConfig xử lý CORS (tránh xung đột) |

### Endpoints tạo ra

```
POST /api/auth/register   ← public
POST /api/auth/login      ← public
GET  /api/auth/me         ← cần token
```

---

## Phase 2 — Category/Brand + Filter sản phẩm

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `entity/Category.java` | Map bảng `categories` |
| `entity/Brand.java` | Map bảng `brands` |
| `entity/ProductCategory.java` | Map bảng `product_categories` |
| `entity/ProductBrand.java` | Map bảng `product_brands` |
| `repository/CategoryRepository.java` | `findByActiveTrue()` |
| `repository/BrandRepository.java` | `findByActiveTrue()` |
| `repository/ProductCategoryRepository.java` | `findProductIdsByCategoryId()` |
| `repository/ProductBrandRepository.java` | `findProductIdsByBrandId()` |
| `controller/CategoryController.java` | GET /api/categories |
| `controller/BrandController.java` | GET /api/brands |

### File cần sửa

| File | Sửa gì |
|------|--------|
| `repository/ProductRepository.java` | Thêm query `findWithFilters(keyword, ids, pageable)` |
| `service/ProductService.java` | Thêm `getFilteredProducts(keyword, categoryId, brandId, page, size)` |
| `controller/ProductController.java` | Thêm query params: `keyword`, `categoryId`, `brandId`, `page`, `size` |

### Endpoints tạo ra / cập nhật

```
GET /api/categories                                          ← public, mới
GET /api/brands                                              ← public, mới
GET /api/products?keyword=&categoryId=&brandId=&page=&size= ← public, nâng cấp
```

---

## Phase 3 — Lịch sử đơn hàng

> ⚠️ Phụ thuộc Phase 1 — phải làm sau khi Auth hoàn thành.

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `dto/OrderItemResponse.java` | productId, productName, price, quantity, subtotal |
| `dto/OrderResponse.java` | id, status, paymentMethod, paymentStatus, createdAt, totalAmount, List\<OrderItemResponse\> |

### File cần sửa

| File | Sửa gì |
|------|--------|
| `repository/OrderRepository.java` | Thêm `findByUserIdOrderByCreatedAtDesc()`, `findByIdAndUserId()` |
| `service/OrderService.java` | `createOrder()` lấy userId từ SecurityContext (không nhận từ request body nữa); thêm `getMyOrders()`, `getOrderById()` |
| `controller/OrderController.java` | Thêm `GET /api/orders/my` và `GET /api/orders/{id}` |

### Endpoints tạo ra / cập nhật

```
POST /api/orders          ← cần token (cập nhật: bỏ userId khỏi body)
GET  /api/orders/my       ← cần token, mới
GET  /api/orders/{id}     ← cần token, mới
```

---

## ✅ Checklist Backend (Hoàng)

### Phase 1 — Auth
- [ ] Thêm dependencies vào `pom.xml`
- [ ] Thêm config JWT vào `application.properties`
- [ ] Tạo `User` entity + `UserRepository`
- [ ] Tạo 3 DTO: `RegisterRequest`, `LoginRequest`, `AuthResponse`
- [ ] Tạo `JwtUtil` + `JwtAuthFilter`
- [ ] Tạo `SecurityConfig` (CORS + filter chain)
- [ ] Sửa `CorsConfig.java`
- [ ] Tạo `AuthService` + `AuthController`
- [ ] Test bằng Postman: register, login, me

### Phase 2 — Category/Filter
- [ ] Tạo 4 entity: `Category`, `Brand`, `ProductCategory`, `ProductBrand`
- [ ] Tạo 4 repository tương ứng
- [ ] Thêm `findWithFilters` vào `ProductRepository`
- [ ] Cập nhật `ProductService` + `ProductController`
- [ ] Tạo `CategoryController` + `BrandController`
- [ ] Test filter keyword + categoryId + brandId

### Phase 3 — Order History
- [ ] Tạo `OrderResponse` + `OrderItemResponse`
- [ ] Cập nhật `OrderRepository`
- [ ] Cập nhật `OrderService` (userId từ SecurityContext, thêm 2 methods)
- [ ] Cập nhật `OrderController` (thêm 2 endpoints)
- [ ] Test: xem đơn hàng, 401 khi không có token, 403 khi xem đơn người khác

---
---

# 👨‍💻 PHẦN 2: FRONTEND (An)

## Phase 1 — Authentication (JWT)

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `context/AuthContext.tsx` | React Context lưu trạng thái auth (user, token, isAuthenticated); actions: login(), logout() |
| `components/ProtectedRoute.tsx` | Nếu chưa login → redirect `/login`; nếu rồi → render children |
| `pages/Login.tsx` | Form: email + password → gọi API login → lưu token → về trang chủ |
| `pages/Register.tsx` | Form: name + email + password + phoneNumber → gọi API register → về trang chủ |

### File cần sửa

| File | Sửa gì |
|------|--------|
| `services/api.ts` | Thêm axios interceptor tự gắn `Authorization: Bearer <token>`; thêm `authService` (login, register, getMe) |
| `App.tsx` | Thêm routes `/login`, `/register`, `/my-orders`; wrap app bằng `<AuthProvider>` |
| `components/Layout.tsx` | Header: chưa login → nút "Đăng nhập/Đăng ký"; đã login → tên user + "Đơn hàng" + "Đăng xuất" |
| `pages/Cart.tsx` | Xoá ô nhập userId thủ công; lấy userId từ `AuthContext`; nếu chưa login → redirect `/login` khi đặt hàng |

### API cần gọi

```
POST /api/auth/register   body: { name, email, password, phoneNumber }
POST /api/auth/login      body: { email, password }
GET  /api/auth/me         header: Authorization: Bearer <token>
```

### Response mẫu từ login/register
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "a@gmail.com",
  "name": "Nguyen Van A",
  "userId": 1,
  "role": "client"
}
```
→ Lưu `token` vào `localStorage.setItem('token', token)`

---

## Phase 2 — Category/Brand + Filter sản phẩm

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `services/categoryService.ts` | `getCategories()`, `getBrands()` |

### File cần sửa

| File | Sửa gì |
|------|--------|
| `types/index.ts` | Thêm `Category`, `Brand`, `PageResponse<T>` |
| `services/api.ts` | Cập nhật `productService.getProducts()` nhận params: `{ keyword, categoryId, brandId, page, size }` → trả `PageResponse<Product>` |
| `pages/Home.tsx` | Fetch danh sách category + brand khi mount; thêm state `keyword`, `selectedCategoryId`, `selectedBrandId`, `page`; debounce 500ms ô tìm kiếm; render sidebar bộ lọc + phân trang |

### API cần gọi

```
GET /api/categories
GET /api/brands
GET /api/products?keyword=&categoryId=&brandId=&page=&size=
```

### Response mẫu `GET /api/products` (mới — dạng Page)
```json
{
  "content": [ { "id": 1, "productName": "Paracetamol 500mg", ... } ],
  "totalElements": 45,
  "totalPages": 4,
  "number": 0,
  "size": 12,
  "first": true,
  "last": false
}
```
> **Lưu ý:** API cũ `GET /api/products` không có params vẫn hoạt động bình thường. Chỉ cần thêm params khi có filter.

---

## Phase 3 — Lịch sử đơn hàng

> ⚠️ Phụ thuộc Phase 1 — token đã có từ AuthContext.

### Các file cần tạo mới

| File | Mô tả |
|------|-------|
| `pages/OrderHistory.tsx` | Gọi `GET /api/orders/my` → danh sách đơn hàng với badge trạng thái + tổng tiền |
| `pages/OrderDetail.tsx` | Gọi `GET /api/orders/{id}` → chi tiết 1 đơn + bảng sản phẩm đã mua |

### File cần sửa

| File | Sửa gì |
|------|--------|
| `types/index.ts` | Thêm `OrderItemResponse`, `OrderResponse` |
| `services/api.ts` | Thêm vào `orderService`: `getMyOrders()`, `getOrderById(id)` |
| `pages/Cart.tsx` | Bỏ `userId` khỏi payload — backend tự lấy từ token |

### API cần gọi

```
GET  /api/orders/my       header: Authorization: Bearer <token>  (token tự động qua interceptor)
GET  /api/orders/{id}     header: Authorization: Bearer <token>
POST /api/orders          body: { paymentMethod, orderItems }    ← bỏ userId
```

### Response mẫu `GET /api/orders/my`
```json
[
  {
    "id": 10,
    "status": "pending",
    "paymentMethod": "cash",
    "paymentStatus": "unpaid",
    "totalAmount": 130000,
    "createdAt": "2026-04-21T18:30:00",
    "items": [
      { "productId": 1, "productName": "Paracetamol 500mg", "price": 50000, "quantity": 2, "subtotal": 100000 }
    ]
  }
]
```

---

## ✅ Checklist Frontend (An)

### Phase 1 — Auth
- [ ] Tạo `AuthContext.tsx`
- [ ] Tạo `ProtectedRoute.tsx`
- [ ] Tạo `Login.tsx`
- [ ] Tạo `Register.tsx`
- [ ] Thêm axios interceptor + `authService` vào `api.ts`
- [ ] Cập nhật `App.tsx` (routes + AuthProvider)
- [ ] Cập nhật `Layout.tsx` (header login/logout)
- [ ] Cập nhật `Cart.tsx` (xoá nhập userId thủ công)

### Phase 2 — Category/Filter
- [ ] Thêm types `Category`, `Brand`, `PageResponse<T>`
- [ ] Tạo `categoryService.ts`
- [ ] Cập nhật `productService.getProducts()` nhận params
- [ ] Cập nhật `Home.tsx` (sidebar lọc + search debounce + phân trang)

### Phase 3 — Order History
- [ ] Thêm types `OrderResponse`, `OrderItemResponse`
- [ ] Thêm `getMyOrders()`, `getOrderById()` vào `api.ts`
- [ ] Tạo `OrderHistory.tsx`
- [ ] Tạo `OrderDetail.tsx`
- [ ] Cập nhật `Cart.tsx` (bỏ `userId` khỏi payload)
