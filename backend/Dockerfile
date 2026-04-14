# --- GIAI ĐOẠN 1: ĐÓNG GÓI CODE ---
# Dùng ổ đĩa ảo có cài sẵn Maven và Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Copy toàn bộ code của ông vào ổ ảo này
COPY . .
# Chạy lệnh build ra file .jar (Bỏ qua test cho nhanh)
RUN mvn clean package -DskipTests

# --- GIAI ĐOẠN 2: CHẠY SERVER ---
# Dùng ổ đĩa ảo siêu nhẹ chỉ chứa môi trường chạy Java 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Lấy file .jar vừa đóng gói ở bước trên ném sang đây
COPY --from=build /app/target/*.jar app.jar
# Mở cổng 8080 cho Internet kết nối vào
EXPOSE 8080
# Lệnh khởi động Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]