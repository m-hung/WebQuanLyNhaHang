# STAGE 1: Mượn môi trường Maven để build mã nguồn thành file .jar

FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Sao chép file cấu hình pom.xml và toàn bộ thư mục src vào container
COPY pom.xml .
COPY src ./src

# Tiến hành build dự án thành file .jar (bỏ qua chạy thử test để tăng tốc độ deploy)
RUN mvn clean package -DskipTests


# STAGE 2: Sử dụng JDK tinh gọn để khởi chạy ứng dụng
FROM eclipse-temurin:17-jdk-alpine

# CÀI ĐẶT GÓI TIMEZONE CHO BẢN ALPINE
RUN apk add --no-cache tzdata
ENV TZ="Asia/Ho_Chi_Minh"

# Thư mục làm việc trong container
WORKDIR /app

# Sao chép file .jar đã build thành công từ STAGE 1 sang STAGE 2
COPY --from=build /app/target/*.jar app.jar

# Khai báo cổng để Render nhận diện dịch vụ
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]