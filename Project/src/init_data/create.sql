DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  username VARCHAR(50) PRIMARY KEY,
  password CHAR (60) NOT NULL,
  dob DATE,
  email VARCHAR(80),
  phone VARCHAR(20),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  location VARCHAR(80)
);

DROP TABLE IF EXISTS flights CASCADE;
CREATE TABLE flights (
  id SERIAL PRIMARY KEY,
  departureTime TIME,
  departureLocation VARCHAR(255),
  arrivalTime TIME,
  arrivalLocation VARCHAR(255),
  arrivalDate VARCHAR(255),
  departureDate VARCHAR(255),
  airline VARCHAR(100),
  departureAirport VARCHAR(10),
  arrivalAirport VARCHAR(10),
  departureCity VARCHAR(255),
  arrivalCity VARCHAR(255),
  totalMinimumFare DECIMAL(10,2),
  flightNumber VARCHAR(10),
  duration VARCHAR(50)
);

DROP TABLE IF EXISTS hotels CASCADE;
CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  areaName VARCHAR(255),
  starRating INT,
  addressLineOne VARCHAR(255),
  cityName VARCHAR(255),
  stateCode VARCHAR(10),
  countryCode VARCHAR(10),
  zip VARCHAR(20)
);

DROP TABLE IF EXISTS planner CASCADE;
CREATE TABLE planner (
  id SERIAL PRIMARY KEY, 
  username VARCHAR(50),
  CONSTRAINT fk_users
        FOREIGN KEY (username)
        REFERENCES users (username)
        ON DELETE SET NULL
);

DROP TABLE IF EXISTS planner_item CASCADE;
CREATE TABLE planner_item (
  item_id SERIAL PRIMARY KEY,
  event_title VARCHAR(255),
  time TIME,
  date DATE,
  location VARCHAR(255),
  description TEXT,
  planner_id INT,
  CONSTRAINT fk_planner
        FOREIGN KEY (planner_id)
        REFERENCES planner (id)
        ON DELETE SET NULL
);

-- DROP TABLE IF EXISTS product CASCADE;
-- CREATE TABLE product (
--     product_id SERIAL PRIMARY KEY,
--     product_type VARCHAR(50) NOT NULL,
--     name VARCHAR(100) NOT NULL,
--     price DECIMAL(10, 2) NOT NULL
-- );
