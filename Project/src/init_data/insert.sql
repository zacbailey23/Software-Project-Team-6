-- INSERT INTO users (username, password) VALUES ($1,$2);
INSERT INTO cars(year, make, model, price, car_id)
VALUES
    (2020, 'Subaru', 'Outback', 200, 1),
    (2019, 'Toyota', 'Pirus', 200, 2),
    (2021, 'Toyota', 'Corolla', 200, 3),
    (2017, 'Honda', 'Civic', 200, 4),
    (2002, 'Honda', 'Accord', 200, 5)
    (2018, 'Volkswagen', 'Golf', 51, 6);

INSERT INTO users (username, password)
VALUES 
    ('audra', 'test'),
    ('hana', 'test'),
    ('zac', 'test'),
    ('noah', 'test')
    ('andrew', 'test');

INSERT INTO flightsReturned (flight_id, departureTime, departureLocation, arrivalTime, arrivalLocation, airline, departureAirport,
    arrivalAirport, departureCity, arrivalCity, totalMinimumFare, city, numberOfConnections)
VALUES 
    (1, '9:10', 'Colorado', '11:10', 'Arizona', 'Southwest', 'DEN', 'TUS', 'Denver', 'Tucson', 373.00, 'Denver', 0),
    (2, '14:00', 'Texas', '23:55', 'New York', 'United', 'AUS', 'ROC', 'Austin', 'Rochester', 342.00, 'Austin', 2),
    (3, '5:50', 'Mexico', '23:40', 'Indiana', 'Southwest', 'SJD', 'IND', 'Los Cabos', 'Indianapolis', 431.00, 'Los Cabos', 1),
    (4, '10:50', 'Tennessee', '18:05', 'Louisiana', 'Frontier', 'MEM', 'MSY', 'Memphis', 'New Orleans', 255.00, 'Memphis', 1),
    (5, '17:00', 'Missouri', '23:15', 'Canada', 'Air Canada', 'STL', 'YOW', 'St. Louis', 'Ottawa', 549.00, 'St. Louis', 0);

INSERT INTO hotels (name, areaName, starRating, addressLineOne, cityName, stateCode, countryCode, zip)
VALUES 
    ('Hotel del Coronado', 'Coronado', 4, '1500 Orange Ave', 'Coronado', 'CA', 'USA', '92118')
    ('Arizona Inn', 'Tucson', 5, '2200 E Elm St', 'Tucson', 'AZ', 'USA', '85719')
    ('Four Seasons Resort Hualalai', 'Kailua-Kona', 5, '72-100 Kaupulehu Drive', 'Kailua-Kona', 'HI', 'USA', '96740')
    ('Denver Marriott Tech Center', 'Denver', 4, '4900 S Syracuse St', 'Denver', 'CO', 'USA', '80237');
    