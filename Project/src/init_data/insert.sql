-- -- INSERT INTO users (username, password) VALUES ($1,$2);
-- INSERT INTO cars(year, make, model, price, car_id)
-- VALUES
--     (2020, 'Subaru', 'Outback', 200, 1),
--     (2019, 'Toyota', 'Pirus', 200, 2),
--     (2021, 'Toyota', 'Corolla', 200, 3),
--     (2017, 'Honda', 'Civic', 200, 4),
--     (2002, 'Honda', 'Accord', 200, 5),
--     (2018, 'Volkswagen', 'Golf', 51, 6),
--     (2012, 'Jeep', 'Liberty', 72, 7),
--     (2016, 'Tesla', 'Model X', 132, 8),
--     (2022, 'Kia', 'Telluride', 81, 9),
--     (2011, 'Chevrolet', 'Cruze LTZ', 67, 10);

INSERT INTO users (username, password)
VALUES 
    ('audra', 'test'),
    ('hana', 'test'),
    ('zac', 'test'),
    ('noah', 'test'),
    ('andrew', 'test');

-- INSERT INTO flightsReturned (flight_id, departureTime, departureLocation, arrivalTime, arrivalLocation, airline, departureAirport,
--     arrivalAirport, departureCity, arrivalCity, totalMinimumFare, city, numberOfConnections)
-- VALUES 
--     (1, "08:00:00", "New York", "11:00:00", "Los Angeles", "Delta Airlines", "JFK", "LAX", "New York", "Los Angeles", 250.00, "New York", 0),
--     (2, "10:30:00", "Chicago", "14:15:00", "Miami", "American Airlines", "ORD", "MIA", "Chicago", "Miami", 300.50, "Chicago", 0),
--     (3, "13:45:00", "San Francisco", "16:30:00", "Seattle", "United Airlines", "SFO", "SEA", "San Francisco", "Seattle", 180.75, "San Francisco", 0),
--     (4, "09:15:00", "Dallas", "12:30:00", "Denver", "Southwest Airlines", "DFW", "DEN", "Dallas", "Denver", 150.25, "Dallas", 0),
--     (5, "07:30:00", "Los Angeles", "10:45:00", "New York", "JetBlue Airways", "LAX", "JFK", "Los Angeles", "New York", 280.00, "Los Angeles", 0),
--     (6, "11:20:00", "Miami", "15:05:00", "Chicago", "American Airlines", "MIA", "ORD", "Miami", "Chicago", 320.75, "Miami", 0),
--     (7, "14:00:00", "Seattle", "17:45:00", "San Francisco", "United Airlines", "SEA", "SFO", "Seattle", "San Francisco", 190.50, "Seattle", 0),
--     (8, "08:45:00", "Denver", "12:00:00", "Dallas", "Southwest Airlines", "DEN", "DFW", "Denver", "Dallas", 160.75, "Denver", 0),
--     (9, "07:15:00", "New York", "10:15:00", "Los Angeles", "Delta Airlines", "JFK", "LAX", "New York", "Los Angeles", 265.50, "New York", 0),
--     (10, "09:45:00", "Chicago", "13:30:00", "Miami", "American Airlines", "ORD", "MIA", "Chicago", "Miami", 310.25, "Chicago", 0),
--     (11, "12:30:00", "San Francisco", "15:15:00", "Seattle", "United Airlines", "SFO", "SEA", "San Francisco", "Seattle", 195.00, "San Francisco", 0),
--     (12, "10:00:00", "Dallas", "13:15:00", "Denver", "Southwest Airlines", "DFW", "DEN", "Dallas", "Denver", 155.25, "Dallas", 0),
--     (13, "08:30:00", "Los Angeles", "11:45:00", "New York", "JetBlue Airways", "LAX", "JFK", "Los Angeles", "New York", 275.00, "Los Angeles", 0),
--     (14, "11:45:00", "Miami", "15:30:00", "Chicago", "American Airlines", "MIA", "ORD", "Miami", "Chicago", 315.75, "Miami", 0),
--     (15, "14:30:00", "Seattle", "18:15:00", "San Francisco", "United Airlines", "SEA", "SFO", "Seattle", "San Francisco", 200.50, "Seattle", 0),
--     (16, "09:45:00", "Denver", "13:00:00", "Dallas", "Southwest Airlines", "DEN", "DFW", "Denver", "Dallas", 165.75, "Denver", 0),
--     (17, "08:15:00", "New York", "11:15:00", "Los Angeles", "Delta Airlines", "JFK", "LAX", "New York", "Los Angeles", 260.50, "New York", 0),
--     (18, "10:30:00", "Chicago", "14:15:00", "Miami", "American Airlines", "ORD", "MIA", "Chicago", "Miami", 305.25, "Chicago", 0),
--     (19, "13:15:00", "San Francisco", "16:00:00", "Seattle", "United Airlines", "SFO", "SEA", "San Francisco", "Seattle", 185.00, "San Francisco", 0),
--     (20, "11:00:00", "Dallas", "14:15:00", "Denver", "Southwest Airlines", "DFW", "DEN", "Dallas", "Denver", 155.50, "Dallas", 0),
--     (21, '9:10', 'Colorado', '11:10', 'Arizona', 'Southwest', 'DEN', 'TUS', 'Denver', 'Tucson', 373.00, 'Denver', 0),
--     (22, '14:00', 'Texas', '23:55', 'New York', 'United', 'AUS', 'ROC', 'Austin', 'Rochester', 342.00, 'Austin', 2),
--     (23, '5:50', 'Mexico', '23:40', 'Indiana', 'Southwest', 'SJD', 'IND', 'Los Cabos', 'Indianapolis', 431.00, 'Los Cabos', 1),
--     (24, '10:50', 'Tennessee', '18:05', 'Louisiana', 'Frontier', 'MEM', 'MSY', 'Memphis', 'New Orleans', 255.00, 'Memphis', 1),
--     (25, '17:00', 'Missouri', '23:15', 'Canada', 'Air Canada', 'STL', 'YOW', 'St. Louis', 'Ottawa', 549.00, 'St. Louis', 0);

INSERT INTO product(product_type, name, price)
VALUES
    ('hotel','Hotel del Coronado',100.00),
    ('hotel','Arizona Inn',100.00),
    ('hotel','Four Seasons Resort Hualalai',100.00),
    ('hotel','Denver Marriott Tech Center',100.00),
    ('hotel','Grand Hyatt New York',100.00),
    ('hotel','Fontainebleau Miami Beach',100.00),
    ('hotel','The Ritz-Carlton, Chicago',100.00),
    ('hotel','The Ritz-Carlton, Denver',100.00),
    ('hotel','The Ritz-Carlton',100.00),
    ('hotel','Fairmont San Francisco',100.00),
    ('hotel','The Joule, Dallas',100.00),
    ('hotel','The Confidante Miami Beach',100.00),
    ('hotel','The Langham, New York, Fifth Ave',100.00),
    ('hotel','The Ritz-Carlton, Denver',100.00),
    ('hotel','The Langham, Chicago',100.00),
    ('hotel','Four Seasons Hotel Miami',100.00),
    ('hotel','The Westin Bonaventure Hotel & S Figueroa St',100.00),
    ('hotel','Hyatt Regency San Francisco',100.00),
    ('hotel','The Adolphus, Autograph Collecti',100.00),
    ('hotel','Eden Roc Miami Beach',100.00),
    ('hotel','The Langham, New York, Fifth Avenue',100.00),
    ('hotel','The Ritz-Carlton, Denver',100.00),
    ('hotel','The Langham, Chicago',100.00),
    ('hotel','Four Seasons Hotel Denver',100.00);


INSERT INTO hotel (id, name, areaName, starRating, addressLineOne, cityName, stateCode, countryCode, zip)
VALUES 
    (1,'Hotel del Coronado', 'Coronado', 4, '1500 Orange Ave', 'Coronado', 'CA', 'USA', '92118'),
    (2,'Arizona Inn', 'Downtown Tucson', 5, '2200 E Elm St', 'Tucson', 'AZ', 'USA', '85719'),
    (3,'Four Seasons Resort Hualalai', 'Kailua-Kona', 5, '72-100 Kaupulehu Drive', 'Kailua-Kona', 'HI', 'USA', '96740'),
    (4,'Denver Marriott Tech Center', 'Downtown Denver', 4, '4900 S Syracuse St', 'Denver', 'CO', 'USA', '80237'),
    (5,'Grand Hyatt New York', 'Midtown Manhattan', 4, 'New York', '109 E 42nd St', 'NY', 'US', '10017'),
    (6,'Fontainebleau Miami Beach', 'Miami Beach', 5, 'Miami Beach', '4441 Collins Ave', 'FL', 'US', '33140'),
    (7,'The Ritz-Carlton, Chicago', 'Magnificent Mile', 4, 'Chicago', '160 E Pearson St', 'IL', 'US', '60611'),
    (8,'The Ritz-Carlton, Denver', 'Downtown Denver', 4, 'Denver', '1881 Curtis St', 'CO', 'US','80202'),
    (9,'The Ritz-Carlton, Los Angeles','Downtown Los Angeles', 4, 'Los Angeles','900 W Olympic Blvd', 'CA', 'US', '90015'),
    (10,'Fairmont San Francisco', 'Nob Hill', 5, 'San Francisco', '950 Mason St', 'CA', 'US', '94108'),
    (11,'The Joule, Dallas','Downtown Dallas', 4, 'Dallas', '1530 Main St', 'TX', 'US', '75201'),
    (12,'The Confidante Miami Beach', 'Miami Beach', 4, 'Miami Beach', '4041 Collins Ave', 'FL', 'US', '33140'),
    (13,'The Langham, New York, Fifth Avenue', 'Midtown Manhattan', 5, 'New York', '400 5th Ave', 'NY', 'US', '10018'),
    (14,'The Ritz-Carlton, Denver', 'Downtown Denver', 4, 'Denver', '1881 Curtis St', 'CO', 'US', '80202'),
    (15,'The Langham, Chicago', 'River North', 4, 'Chicago','330 N Wabash Ave', 'IL', 'US', '60611'),
    (16,'Four Seasons Hotel Miami', 'Brickell', 5, 'Miami', '1435 Brickell Ave', 'FL', 'US', '33131'),
    (17,'The Westin Bonaventure Hotel & Suites, Los Angeles', 'Downtown Los Angeles', 4, 'Los Angeles', '404 S Figueroa St', 'CA', 'US', '90071'),
    (18,'Hyatt Regency San Francisco', 'Embarcadero', 4, 'San Francisco', '5 Embarcadero Center', 'CA', 'US', '94111'),
    (19,'The Adolphus, Autograph Collection', 'Downtown Dallas', 4, 'Dallas', '1321 Commerce St', 'TX', 'US', '75202'),
    (20,'Eden Roc Miami Beach', 'Miami Beach', 4, 'Miami Beach', '4525 Collins Ave', 'FL', 'US', '33140'),
    (21,'The Langham, New York, Fifth Avenue', 'Midtown Manhattan', 5, 'New York', '400 5th Ave', 'NY', 'US', '10018'),
    (22,'The Ritz-Carlton, Denver', 'Downtown Denver', 4, 'Denver', '1881 Curtis St', 'CO', 'US', '80202'),
    (23,'The Langham, Chicago', 'River North', 4, 'Chicago', '330 N Wabash Ave', 'IL', 'US', '60611'),
    (24,'Four Seasons Hotel Denver', 'Downtown Denver', 5, 'Denver', '1111 14th St', 'CO', 'US', '80202');
    