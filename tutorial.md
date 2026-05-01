Về phần Backend hiện tại, tôi đã rà soát lại toàn bộ kiến trúc và logic code. Có thể tự tin nói rằng Backend của bạn đang được viết theo đúng chuẩn thực tế tại các doanh nghiệp (Best Practices).
Dưới đây là 4 điểm sáng giá chứng minh hệ thống của bạn "rất chuẩn":
1.	Kiến trúc Layered Architecture rõ ràng: Phân tách hoàn toàn các lớp Controller (Tiếp nhận request) -> Service (Xử lý nghiệp vụ) -> Repository (Giao tiếp DB) -> Entity (Cấu trúc bảng). Không code trộn lẫn logic vào nhau.
2.	Bảo mật & DTO (Data Transfer Object): Không trả thẳng Entity ra ngoài API để tránh rò rỉ dữ liệu nhạy cảm (như profit). Tách biệt rõ OrderRequest, OrderSummaryResponse, và ProductSummaryDto.
3.	Tối ưu hóa hiệu năng (Performance):
- Đã dùng Phân trang (Pagination) để không kéo hàng nghìn sản phẩm cùng lúc.
- Giải quyết triệt để lỗi N+1 Query trong OrderService bằng cách dùng hàm findAllById thay vì gọi DB vòng lặp liên tục để lấy tên sản phẩm.
4.	Bảo mật JWT an toàn: Tách CustomUserDetailsService để tránh Circular Dependency (một lỗi rất khó chịu của Spring), phiên làm việc Stateless chuẩn REST API.
(Điểm có thể cải thiện thêm sau này: Xây dựng một file GlobalExceptionHandler bắt lỗi tập trung thay vì dùng try-catch lắt nhắt ở từng Controller).
---
 Lộ Trình Đào Tạo (Course Syllabus): "Xây Dựng Backend E-Commerce Chuẩn Doanh Nghiệp"
Nếu bạn muốn dùng Project này làm giáo án hướng dẫn một sinh viên mới học lập trình, bạn có thể chia thành 7 Modules (Tương ứng với 7 Tuần học) như sau. Lộ trình này đi từ tư duy căn bản đến giải quyết vấn đề thực tế.
## Module 1: Khởi động & Nền tảng (Tuần 1)
Mục tiêu: Hiểu cách Web hoạt động và cài đặt công cụ.
- Bài 1: RESTful API là gì? HTTP Methods (GET, POST, PUT, DELETE) hoạt động ra sao? Cấu trúc JSON.
- Bài 2: Cài đặt vũ khí: Java JDK 21, IntelliJ IDEA, MySQL, Postman.
- Bài 3: Khởi tạo dự án Spring Boot đầu tiên (Spring Initializr, Maven, cấu trúc thư mục).
- Bài 4: Viết API "Hello World" đầu tiên với @RestController và @GetMapping.
## Module 2: Thao tác Cơ Sở Dữ Liệu với Spring Data JPA (Tuần 2)
Mục tiêu: Kết nối DB và làm chủ các thao tác CRUD cơ bản.
- Bài 1: Cấu hình application.properties kết nối MySQL.
- Bài 2: Ánh xạ bảng thành Code: @Entity, @Table, @Id, @Column (Thực hành với bảng products).
- Bài 3: Sức mạnh của Spring Data JPA: Tạo ProductRepository và các hàm có sẵn (save, findAll, findById).
- Bài 4: Dependency Injection (Tiêm phụ thuộc): @Service, @Autowired, @RequiredArgsConstructor. Xây dựng luồng Controller -> Service -> Repository.
## Module 3: Nghệ thuật "Giấu dữ liệu" với DTO & Validation (Tuần 3)
Mục tiêu: Hiểu tại sao không được trả Entity thô ra ngoài.
- Bài 1: DTO (Data Transfer Object) là gì? Lỗi bảo mật do rò rỉ dữ liệu (Bài học từ bảng orders chứa cột profit).
- Bài 2: Lombok: Viết code Java ngắn gọn (@Data, @Builder, @NoArgsConstructor).
- Bài 3: Validate đầu vào: @Valid, @NotBlank, @Email để chặn dữ liệu rác từ user.
## Module 4: Tối ưu Hiệu năng Cấp cao (Tuần 4)
Mục tiêu: Chống sập Server khi có quá nhiều dữ liệu.
- Bài 1: Vấn đề Over-fetching và cách giải quyết (Tại sao không lấy productDescription ở trang chủ).
- Bài 2: Thực hành Phân trang (Pagination) với Pageable và PageRequest.
- Bài 3: Viết Custom Query với @Query (JPQL): Xây dựng bộ lọc Sản phẩm theo Keyword, Category, Brand.
## Module 5: Bảo mật Spring Security & JWT (Bản Hoàn Hảo)
Bảo mật luôn là phần khó nhất đối với người mới học lập trình Backend. Module này hướng dẫn chi tiết cách xây dựng hệ thống Đăng ký, Đăng nhập và phân quyền bằng JWT, áp dụng đúng các best practices trong dự án thực tế.

### Bài 1: Cấu trúc DTO cho xác thực
**Tiêu đề bài học: Cấu trúc DTO cho xác thực (Auth DTOs)**

**Các mục kiến thức chính:**

RegisterRequest – nhận dữ liệu đăng ký từ client

LoginRequest – nhận email/password khi đăng nhập

AuthResponse – trả về token và thông tin user sau khi xác thực thành công

**Nội dung chi tiết:**

Để nhận dữ liệu từ client và trả về kết quả, chúng ta cần 3 DTO. Việc thiết kế DTO dựa trên nhu cầu của frontend và các trường có sẵn trong entity User.

java
// RegisterRequest.java – gửi lên khi đăng ký
@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String phoneNumber; // không bắt buộc
}

// LoginRequest.java – gửi lên khi đăng nhập
@Data
public class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;
}

// AuthResponse.java – trả về sau khi đăng ký / đăng nhập thành công
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String name;
    private String role; // "admin" hoặc "client"
}
**Ví dụ:** Client gửi POST /api/auth/register với JSON body chứa name, email, password. Server trả về AuthResponse chứa JWT token và thông tin user.

**Ghi chú quan trọng:**

Không bao giờ trả mật khẩu hay thông tin nhạy cảm trong response.

role được chuyển từ roleId (Long) sang String để frontend dễ hiển thị và phân quyền.

**Tóm tắt nhanh:** Dùng RegisterRequest và LoginRequest để nhận dữ liệu, AuthResponse để trả kết quả kèm token.

### Bài 2: Tạo CustomUserDetailsService
**Tiêu đề bài học: Tạo CustomUserDetailsService – cầu nối giữa User Entity và Spring Security**

**Các mục kiến thức chính:**

Interface UserDetailsService của Spring Security

Phương thức loadUserByUsername(String email)

Sử dụng UserRepository để tìm user

**Nội dung chi tiết:**

Spring Security cần một cách để tải thông tin người dùng từ database dựa trên tên đăng nhập (ở đây là email). Interface UserDetailsService có một phương thức duy nhất: loadUserByUsername. Chúng ta tạo class CustomUserDetailsService implements interface này và sử dụng UserRepository để truy vấn.

java
package com.pharma.backend.security;

import com.pharma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
**Ví dụ:** Khi người dùng đăng nhập, Spring Security tự động gọi loadUserByUsername("user@example.com") để lấy UserDetails (chính là entity User của bạn đã implements UserDetails).

**Ghi chú quan trọng:**

UserRepository.findByEmail phải trả về Optional<User>.

Entity User phải implements UserDetails (đã làm ở bài trước).

Ném UsernameNotFoundException nếu không tìm thấy.

**Tóm tắt nhanh:** CustomUserDetailsService là lớp trung gian giúp Spring Security load user từ database bằng email.

### Bài 3: JwtUtil – Trái tim sinh và xác thực token
**Tiêu đề bài học: JwtUtil – Trái tim sinh và xác thực token**

**Các mục kiến thức chính:**

Thư viện JJWT 0.12.6

Tạo secret key bằng Keys.hmacShaKeyFor

Sinh token (generateToken)

Trích xuất email, kiểm tra hạn (extractEmail, isTokenValid)

**Nội dung chi tiết:**

JwtUtil là class tiện ích chịu trách nhiệm tạo JWT, giải mã và kiểm tra tính hợp lệ. Nó sử dụng thư viện jjwt đã khai báo trong pom.xml. Secret key và thời gian sống được cấu hình trong application.properties.

java
package com.pharma.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;    // phải có trong application.properties, độ dài >=32 ký tự

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;  // ví dụ: 86400000 = 24 giờ

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }
}
**Ví dụ:** Khi user đăng nhập thành công, gọi jwtUtil.generateToken(user) để tạo chuỗi token. Khi user gọi API cần xác thực, filter sẽ dùng extractEmail và isTokenValid để kiểm tra.

**Ghi chú quan trọng:**

Secret key phải được lưu trong biến môi trường hoặc file cấu hình, không hardcode.

Thời gian sống (expiration) nên từ 15 phút đến 24 giờ tùy yêu cầu.

**Tóm tắt nhanh:** JwtUtil cung cấp các phương thức để sinh, giải mã và kiểm tra JWT.

### Bài 4: JwtAuthFilter – Bộ lọc xác thực token
**Tiêu đề bài học: JwtAuthFilter – Bộ lọc xác thực token**

**Các mục kiến thức chính:**

Kế thừa OncePerRequestFilter

Lấy token từ header Authorization

Đặt Authentication vào SecurityContextHolder

Xử lý token không hợp lệ

**Nội dung chi tiết:**

JwtAuthFilter chặn mọi request trước khi đến controller. Nó kiểm tra header Authorization có chứa Bearer <token> hay không. Nếu token hợp lệ, nó tạo đối tượng UsernamePasswordAuthenticationToken và gắn vào SecurityContextHolder để Spring Security biết user đã được xác thực.

java
package com.pharma.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Không có token hoặc không đúng định dạng → cho qua (sẽ bị SecurityConfig chặn sau)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        final String email;

        try {
            email = jwtUtil.extractEmail(token);
        } catch (Exception e) {
            // Token không hợp lệ (hết hạn, sai chữ ký…) → cho qua nhưng không set authentication
            filterChain.doFilter(request, response);
            return;
        }

        // Nếu email hợp lệ và chưa có authentication trong context
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtUtil.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
**Ví dụ:** Request GET /api/orders/my có header Authorization: Bearer eyJhbGci.... Filter giải mã token, lấy email, load user, set authentication thành công.

**Ghi chú quan trọng:**

WebAuthenticationDetailsSource ghi thêm thông tin IP, session (nếu có) vào authentication.

Nếu token lỗi, filter vẫn cho request đi tiếp nhưng không set authentication → sau đó SecurityConfig sẽ từ chối nếu endpoint yêu cầu xác thực.

**Tóm tắt nhanh:** JwtAuthFilter là người gác cổng đọc và xác thực token, gắn đối tượng Authentication vào SecurityContext.

### Bài 5: SecurityConfig – Cấu hình bảo mật toàn diện
**Tiêu đề bài học: SecurityConfig – Cấu hình bảo mật toàn diện**

**Các mục kiến thức chính:**

Các bean: PasswordEncoder, AuthenticationProvider, AuthenticationManager

CORS cấu hình chi tiết

Phân quyền endpoint theo HTTP method

Tích hợp JwtAuthFilter vào SecurityFilterChain

**Nội dung chi tiết:**

SecurityConfig là nơi tập trung cấu hình mọi thứ liên quan đến bảo mật: CSRF, CORS, session management, phân quyền, và kết nối các thành phần với nhau.

java
package com.pharma.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService customUserDetailsService;

    // Bean mã hóa mật khẩu (dùng BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean cung cấp AuthenticationProvider (kết nối UserDetailsService và PasswordEncoder)
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // Bean quản lý xác thực (dùng cho login)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Cấu hình CORS cụ thể (cho phép frontend gọi API từ domain khác)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // Cho phép mọi origin (chỉ nên dùng trong dev)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // Cho phép gửi cookie/token qua CORS

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)  // Tắt CSRF (vì dùng JWT)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Áp dụng CORS
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless
            .authorizeHttpRequests(auth -> auth
                // Public endpoints – không cần token
                .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**", "/api/categories/**", "/api/brands/**").permitAll()
                // Các endpoint khác đều yêu cầu xác thực
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider()) // Đăng ký AuthenticationProvider
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Thêm filter JWT

        return http.build();
    }
}
**Ví dụ:**

POST /api/auth/register – cho phép tất cả.

GET /api/products – cho phép tất cả (xem sản phẩm).

POST /api/orders – yêu cầu token (phải đăng nhập).

**Ghi chú quan trọng:**

CORS cấu hình setAllowedOriginPatterns thay vì setAllowedOrigins cho phép dùng dấu * an toàn hơn.

SessionCreationPolicy.STATELESS là bắt buộc vì JWT không dùng session.

addFilterBefore đảm bảo JwtAuthFilter chạy trước filter mặc định của Spring Security.

**Tóm tắt nhanh:** SecurityConfig là trung tâm cấu hình mọi quy tắc bảo mật, CORS, và kết nối các thành phần với nhau.

### Bài 6: AuthService – Xử lý đăng ký và đăng nhập
**Tiêu đề bài học: AuthService – Xử lý đăng ký và đăng nhập**

**Các mục kiến thức chính:**

Đăng ký: kiểm tra email tồn tại, băm mật khẩu, lưu user, sinh token

Đăng nhập: kiểm tra email và mật khẩu, xác thực bằng PasswordEncoder, sinh token

Chuyển đổi roleId thành role string

**Nội dung chi tiết:**

AuthService chứa logic nghiệp vụ chính cho hai luồng đăng ký và đăng nhập. Nó sử dụng UserRepository, PasswordEncoder, JwtUtil.

java
package com.pharma.backend.service;

import com.pharma.backend.dto.AuthResponse;
import com.pharma.backend.dto.LoginRequest;
import com.pharma.backend.dto.RegisterRequest;
import com.pharma.backend.entity.User;
import com.pharma.backend.repository.UserRepository;
import com.pharma.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .roleId(0L)          // Mặc định role client
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);
        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        if (user.getActive() == null || !user.getActive()) {
            throw new BadCredentialsException("Account is disabled");
        }

        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        String role = (user.getRoleId() != null && user.getRoleId() == 1L) ? "admin" : "client";
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(role)
                .build();
    }
}
**Ví dụ:**

register nhận RegisterRequest, lưu user, trả về token và thông tin.

login kiểm tra email và mật khẩu, nếu đúng trả token.

**Ghi chú quan trọng:**

Sử dụng BadCredentialsException để thông báo sai thông tin đăng nhập.

Phương thức buildAuthResponse tái sử dụng logic chuyển roleId thành String.

**Tóm tắt nhanh:** AuthService xử lý đăng ký và đăng nhập, trả về AuthResponse chứa token và thông tin user.

### Bài 7: AuthController – Lộ API xác thực
**Tiêu đề bài học: AuthController – Lộ API xác thực**

**Các mục kiến thức chính:**

Endpoint POST /api/auth/register

Endpoint POST /api/auth/login

Endpoint GET /api/auth/me lấy thông tin user từ token

Xử lý ngoại lệ trả về HTTP status code phù hợp

**Nội dung chi tiết:**

AuthController là nơi lộ ra các API cho client gọi. Nó nhận request, gọi AuthService và trả về response kèm các mã HTTP đúng chuẩn (201 Created, 200 OK, 400 Bad Request, 401 Unauthorized).

java
package com.pharma.backend.controller;

import com.pharma.backend.dto.AuthResponse;
import com.pharma.backend.dto.LoginRequest;
import com.pharma.backend.dto.RegisterRequest;
import com.pharma.backend.entity.User;
import com.pharma.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String role = (user.getRoleId() != null && user.getRoleId() == 1L) ? "admin" : "client";
        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", role
        ));
    }
}
**Ví dụ:**

POST /api/auth/register → 201 Created + token.

POST /api/auth/login với sai password → 401 Unauthorized.

GET /api/auth/me với header Authorization: Bearer <token> → trả thông tin user.

**Ghi chú quan trọng:**

Authentication authentication trong /me được Spring tự động inject sau khi JwtAuthFilter đã xác thực thành công.

Nếu chưa đăng nhập, endpoint /me sẽ trả về 401 do SecurityConfig chặn.

**Tóm tắt nhanh:** AuthController cung cấp 3 API cần thiết cho luồng đăng ký, đăng nhập và lấy thông tin user hiện tại.

### Bài 8: Tổng kết Module 5 – Kiểm tra và vận hành
**Tiêu đề bài học: Tổng kết Module 5 – Kiểm tra và vận hành**

**Các mục kiến thức chính:**

Cấu hình tham số JWT trong application.properties

Kiểm thử bằng Postman

Luồng hoạt động tổng thể

**Nội dung chi tiết:**

1. Thêm cấu hình JWT vào application.properties

properties
# JWT Configuration
app.jwt.secret=your_very_long_secret_key_at_least_32_characters_long_here
app.jwt.expiration=86400000
2. Kiểm thử bằng Postman

Đăng ký: POST http://localhost:8080/api/auth/register
Body JSON: {"name":"John","email":"john@example.com","password":"123456"}

Đăng nhập: POST http://localhost:8080/api/auth/login
Body JSON: {"email":"john@example.com","password":"123456"}

Lấy thông tin cá nhân: GET http://localhost:8080/api/auth/me
Header: Authorization: Bearer <token_nhận_được}

3. Luồng hoạt động tổng thể

text
Client gọi /register hoặc /login
      ↓
AuthController nhận request → gọi AuthService
      ↓
AuthService kiểm tra, mã hóa mật khẩu (nếu đăng ký) hoặc so sánh (nếu login)
      ↓
Tạo token bằng JwtUtil → trả về AuthResponse
      ↓
Client lưu token, gửi kèm trong header Authorization ở các request sau
      ↓
JwtAuthFilter xác thực token → set Authentication vào SecurityContextHolder
      ↓
Controller có thể dùng @AuthenticationPrincipal hoặc Authentication để lấy user
**Ghi chú quan trọng:**

Đảm bảo secret key có độ dài >= 32 ký tự, không nên hardcode trong source.

Nên dùng biến môi trường (${JWT_SECRET}) để bảo mật trong production.

**Tóm tắt nhanh module:**

8 bài học từ DTO, CustomUserDetailsService, JwtUtil, JwtAuthFilter, SecurityConfig, AuthService, AuthController đến kiểm thử.

Toàn bộ code đã sẵn sàng để chạy trong dự án thực tế.



## Module 6: Xử lý Luồng Nghiệp vụ Phức tạp (Order Flow & Tối ưu Query)
Trong module này, chúng ta sẽ bước vào phần "linh hồn" của hệ thống E-commerce: Đặt hàng. Bạn sẽ học cách lưu nhiều bảng cùng lúc một cách an toàn và tối ưu hóa truy vấn để tránh sập Database khi hệ thống lớn lên.

---

### Bài 1: Luồng tạo Đơn hàng (Order Flow)
Khi người dùng bấm "Thanh toán", Frontend sẽ gửi xuống một mảng các sản phẩm họ muốn mua. 

**Vấn đề:** Bảng order_items cần khóa ngoại order_id để biết nó thuộc về đơn hàng nào. Nhưng lúc này đơn hàng chưa hề tồn tại!
**Giải pháp:** Phải lưu Order trước để DB cấp phát sinh ra id. Sau đó lấy cái id vừa sinh ra gán ngược vào từng OrderItem rồi mới lưu toàn bộ OrderItem.

`java
// OrderService.java (Trích đoạn createOrder)
public OrderSummaryResponse createOrder(OrderRequest request, Authentication authentication) {
    // 1. Lấy user đang đăng nhập từ JWT
    User user = (User) authentication.getPrincipal();

    // 2. Tạo và lưu Order trước để lấy ID
    Order order = new Order();
    order.setUserId(user.getId());
    order.setStatus("pending");
    order.setPaymentStatus("unpaid");
    order.setCreatedAt(LocalDateTime.now());
    Order savedOrder = orderRepository.save(order); // Lúc này savedOrder đã có ID

    // 3. Gán Order ID vào từng món hàng và lưu hàng loạt
    List<OrderItem> orderItems = request.getOrderItems();
    if (orderItems != null && !orderItems.isEmpty()) {
        for (OrderItem item : orderItems) {
            item.setOrderId(savedOrder.getId()); // Cực kỳ quan trọng!
            item.setCreatedAt(LocalDateTime.now());
        }
        orderItemRepository.saveAll(orderItems);
    }

    return toOrderSummaryResponse(savedOrder, orderItems != null ? orderItems.size() : 0);
}
`

---

### Bài 2: Quản lý Transaction (@Transactional)
Hãy tưởng tượng: Hệ thống lưu Order thành công, nhưng khi đang lưu danh sách OrderItem thì... cúp điện hoặc lỗi mạng! 
Hậu quả: Database xuất hiện một đơn hàng "ma" không có sản phẩm nào.

Để giải quyết, ta đặt Annotation @Transactional lên đầu hàm createOrder. 
Kỹ thuật này gọi là **All or Nothing (Thành công tất cả hoặc không có gì cả)**. Nếu có bất kỳ lỗi Exception nào văng ra giữa chừng, Spring sẽ tự động Rollback (hủy bỏ) thao tác lưu Order trước đó, trả Database về trạng thái vẹn toàn.

`java
    @Transactional
    public OrderSummaryResponse createOrder(OrderRequest request, Authentication authentication) {
        // logic...
    }
`

---

### Bài 3: Tránh Over-fetching (Dư thừa dữ liệu)
Khi người dùng vào màn hình "Lịch sử đơn hàng", họ chỉ cần xem danh sách khái quát: Mã đơn, Ngày đặt, Tổng tiền, Số lượng món. Họ KHÔNG CẦN xem chi tiết từng món.
Nếu trả về toàn bộ mảng items, bạn đang làm lãng phí băng thông mạng. Ta dùng OrderSummaryResponse để giải quyết.

`java
// OrderController.java
    @GetMapping("/my")
    public ResponseEntity<List<OrderSummaryResponse>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getMyOrders(authentication));
    }
`
Lúc này DTO OrderSummaryResponse chỉ chứa đúng các trường cơ bản như 	otalAmount, itemCount, tuyệt đối không chứa mảng items. Kỹ thuật này giúp API cực nhanh nhẹn.

---

### Bài 4: Sát thủ hiệu năng - Lỗi N+1 Query
Khi người dùng bấm vào xem "Chi tiết 1 đơn hàng", ta phải trả về OrderResponse chứa danh sách các món ăn (OrderItemResponse). Nhưng bảng order_items chỉ chứa product_id, không có tên sản phẩm. Làm sao lấy tên?

**Cách code ngây thơ (Gây lỗi N+1):**
Duyệt vòng lặp qua từng OrderItem, mỗi vòng lặp gọi productRepository.findById(id) để lấy tên. Nếu đơn hàng có 100 món, ta bắn 100 câu query SELECT vào DB. DB sẽ bị nghẽn!

**Cách code Senior (Batch Query):**
Gom tất cả product_id lại, và bắn duy nhất 1 câu query SELECT * FROM products WHERE id IN (1, 2, 3...). 
Đây là đoạn code thực tế trong dự án của chúng ta:

`java
    private OrderResponse toOrderResponse(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        // 1. Gom tất cả Product IDs lại thành 1 list
        List<Long> productIds = items.stream()
                .map(OrderItem::getProductId)
                .collect(Collectors.toList());

        // 2. Bắn 1 câu Query duy nhất (IN) và gom kết quả thành Map<Id, Tên>
        Map<Long, String> productNameMap = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, Product::getProductName));

        // 3. Map dữ liệu siêu tốc trên RAM thay vì gọi DB
        List<OrderItemResponse> itemResponses = items.stream()
                .map(item -> {
                    BigDecimal subtotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    return OrderItemResponse.builder()
                            .productId(item.getProductId())
                            .productName(productNameMap.getOrDefault(item.getProductId(), "Unknown")) // Lấy từ Map
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        // ... tính totalAmount và return
    }
`
Cách này giúp giảm số lượng query từ N+1 xuống cố định là 2 query, bất kể đơn hàng có 1000 món!
