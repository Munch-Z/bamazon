CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NOT NULL,
    price FLOAT(11) NOT NULL,
    stock_quantity INT(11) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Hammer", "Tools", 10.50, 10),
("Pillow", "Home Goods", 5.00, 25),
("Motherboard", "Computers", 250.00, 5),
("Graphics Card", "Computers", 650.00, 6),
("Keyboard", "Computers", 100.00, 11),
("Mouse", "Computer", 50.00, 4),
("Drill", "Tools", 25.00, 3),
("Nails", "Tools", .50, 1300),
("Blanket", "Home Goods", 1000.00, 2),
("Pot", "Home Goods", 40.00, 8);