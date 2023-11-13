DROP TABLE IF EXISTS user CASCADE ;
CREATE TABLE user(
    username VARCHAR(50) SERIAL PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS cars CASCADE;
CREATE TABLE cars(
    year CHAR(12),
    make VARCHAR(50),
    model VARCHAR(50),
    price DECIMAL,
    car_id INT PRIMARY KEY
);

DROP TABLE IF EXISTS planner CASCADE;
CREATE TABLE planner(
    username VARCHAR(50),
    description LONGTEXT,
    cart_id FOREIGN KEY
);

DROP TABLE IF EXISTS cartItem CASCADE;
CREATE TABLE cartItem(
    item_id SERIAL PRIMARY KEY,
    username VARCHAR(50) FOREIGN KEY, --dont think we need username 
    location VARCHAR(50),
    --need some sort of "flight" ascept or something that connects with the ticket price so prolly another table for flights
    ticket_price DECIMAL,
    car_id FOREIGN KEY,
    date DATE,
    time TIME,
    total Decimal
);