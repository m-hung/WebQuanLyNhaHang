-- 1. Xóa bảng cũ nếu tồn tại để đảm bảo cấu trúc mới được áp dụng
DROP TABLE IF EXISTS `restaurant_tables`;

-- 2. Tạo bảng với ràng buộc UNIQUE cho cột table_number
CREATE TABLE `restaurant_tables` (
    `table_id` BIGINT NOT NULL AUTO_INCREMENT,
    `capacity` INT DEFAULT NULL,
    `status` VARCHAR(255) DEFAULT NULL,
    `table_number` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`table_id`),
    UNIQUE KEY `UK_table_number` (`table_number`) -- Đây là dòng quan trọng nhất
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Sau đó mới thực hiện INSERT dữ liệu
INSERT INTO restaurant_tables (table_id, table_number, capacity, status)
VALUES
(1, '1', 2, 'Available'),
(2, '2', 2, 'Available'),
(3, '3', 4, 'Available'),
(4, '4', 4, 'Available'),
(5, '5', 10, 'Available'),
(6, '6', 10, 'Available')
ON DUPLICATE KEY UPDATE
    table_number = VALUES(table_number),
    capacity = VALUES(capacity),
    status = VALUES(status);

ALTER TABLE restaurant_tables AUTO_INCREMENT = 7;