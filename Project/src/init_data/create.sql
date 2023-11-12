CREATE TABLE users(
    username VARCHAR(50) SERIAL PRIMARY KEY,
    password CHAR(60) NOT NULL
);

CREATE TABLE cars(
    year CHAR(12),
    make VARCHAR(50),
    model VARCHAR(50),
    price DECIMAL,
    car_id INT PRIMARY KEY
);

CREATE TABLE planner(
    username VARCHAR(50),
    description LONGTEXT,
    date DATE,
    time TIME,
    cart_id FOREIGN KEY
);
