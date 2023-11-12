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
    cart_id FOREIGN KEY
);

CREATE TABLE cart(
    cart_id SERIAL PRIMARY KEY,
    username VARCHAR(50) FOREIGN KEY,
    location VARCHAR(50),
    ticket_price DECIMAL,
    car_id FOREIGN KEY,
    date DATE,
    time TIME,
    total Decimal
);