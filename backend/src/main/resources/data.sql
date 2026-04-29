-- Xóa dữ liệu cũ nếu muốn làm sạch mỗi lần chạy
-- DELETE FROM categories;

-- INSERT INTO categories (name) VALUES ('Món khai vị');
-- INSERT INTO categories (name) VALUES ('Món chính');
-- INSERT INTO categories (name) VALUES ('Đồ uống');

INSERT IGNORE INTO restaurant_tables (table_number, capacity, status) VALUES
('1', 2, 'Available'),
('2', 2, 'Available'),
('3', 4, 'Available'),
('4', 4, 'Available'),
('5', 10, 'Available'),
('6', 10, 'Available');