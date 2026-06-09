SET NAMES utf8mb4;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(6) DEFAULT NULL,
    `full_name` VARCHAR(255) DEFAULT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `role` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `UK_username` (`username`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`user_id`, `created_at`, `full_name`, `password`, `email`, `role`, `status`, `username`)
VALUES
    (1, NOW(), 'Admin', '$2a$12$JY3yC3yigNqX72HeFFWVgeK2APgmPxMq8vNJO9axzeIxl9AkzM69O', 'celestehousecontact@gmail.com', 'ADMIN', 'ACTIVE', 'admin'),
    (2, NOW(), 'Nguyễn Khánh Hưng', '$2a$12$/owPlCOfqbwAtsfW6IFY1uCBKruvGHvPRQnWrythTf2EIsQH/gP9O', NULL, 'MANAGER', 'ACTIVE', 'KhanhHung'),
    (3, NOW(), 'Thái Trần Minh Hưng', '$2a$12$/owPlCOfqbwAtsfW6IFY1uCBKruvGHvPRQnWrythTf2EIsQH/gP9O', NULL, 'CASHIER', 'ACTIVE', 'MinhHung'),
    (4, NOW(), 'Nguyễn Tiến Hưng', '$2a$12$/owPlCOfqbwAtsfW6IFY1uCBKruvGHvPRQnWrythTf2EIsQH/gP9O', NULL, 'CASHIER', 'ACTIVE', 'TienHung'),
    (5, NOW(), 'Nguyễn Gia Huy', '$2a$12$/owPlCOfqbwAtsfW6IFY1uCBKruvGHvPRQnWrythTf2EIsQH/gP9O', NULL, 'CASHIER', 'ACTIVE', 'GiaHuy')
ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    password = VALUES(password),
    role = VALUES(role),
    status = VALUES(status);

ALTER TABLE `users` AUTO_INCREMENT = 2;