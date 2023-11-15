DROP TABLE IF EXISTS user CASCADE ;
CREATE TABLE user(
    username VARCHAR(50),
    password CHAR(60) NOT NULL,
    user_id SERIAL PRIMARY KEY
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
    cart_id SERIAL PRIMARY KEY,
    user_id FOREIGN KEY, 
    location VARCHAR(50),
    --need some sort of "flight" ascept or something that connects with the ticket price so prolly another table for flights
    flight_destination FOREIGN KEY,
    hotel_location FOREIGN KEY,
    ticket_price DECIMAL,
    car_id FOREIGN KEY,
    date DATE,
    time TIME,
    total Decimal
);

DROP TABLE IF EXISTS flights CASCADE;
CREATE TABLE flights(
    flight_destination VARCHAR(50) PRIMARY KEY,
    sort_by VARCHAR(50),
    departure TIME,
    type VARCHAR(50), --one-way/Round-trip
    class VARCHAR(50),
    departure_location VARCHAR(50),
    price Decimal,
    flight_duration INT, --Time given in minutes
);

DROP TABLE IF EXISTS hotels CASCADE;
CREATE TABLE hotels(
    hotel_location VARCHAR(50) PRIMARY KEY,
    checkout TIME,
    checkin TIME,
    hotel_sort VARCHAR(50),
    location_id INT,
    rooms INT,
    rating decimal
);

