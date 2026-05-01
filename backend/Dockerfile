# Sử dụng JDK để build và chạy ứng dụng
FROM eclipse-temurin:17-jdk-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy file jar đã build vào container
# Lưu ý: Bạn cần chạy 'mvn clean package' trước để có file jar trong thư mục target
COPY target/*.jar app.jar

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]