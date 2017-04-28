CREATE NEW DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,  
    product_name VARCHAR(50) NOT NULL, 
    department_name VARCHAR(50) NOT NULL, 
    price DECIMAL(7, 2) NOT NULL, 
    stock INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock)
VALUES ('Dress Shirt', 'Apparel', 20, 100),
    ('Slacks', 'Apparel', 15, 100),
    ('White T-Shirt', 'Apparel', 15, 500),
    ('Black T-Shirt', 'Apparel', 15, 500),
    ('Grey T-Shirt', 'Apparel', 15, 500),
    ('Black T-Shirt', 'Apparel', 15, 500),
    ('Basketball', 'Sporting Goods', 21, 50),
    ('Volleyball', 'Sporting Goods', 25, 50),
    ('Soccer Ball', 'Sporting Goods', 19, 50)