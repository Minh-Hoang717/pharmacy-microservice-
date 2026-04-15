# Chạy môi trường Node.js để Build Frontend
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Khôi phục Dependencies ưu tiên Caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ code vào Container
COPY . .

# Argument khai báo đường dẫn API lúc Build (Mặc định gọi tới Backend ở localhost)
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build code Frontend thành dạng Production tĩnh (dist)
RUN npm run build

# Giai đoạn 2: Serve bằng Nginx siêu nhẹ
FROM nginx:alpine

# Copy kết quả Build sang thư mục public của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Ghi đè file Nginx config để cấu hình React Router (Tránh lỗi 404 khi F5)
RUN echo "server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Mở cổng 80 cho người dùng truy cập
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
