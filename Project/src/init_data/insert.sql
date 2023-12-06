INSERT INTO users (username, password)
VALUES 
    ('audra', 'test'),
    ('hana', 'test'),
    ('zac', 'test'),
    ('noah', 'test'),
    ('andrew', 'test');

INSERT INTO flights (departureTime, departureLocation, arrivalTime, arrivalLocation, arrivalDate, departureDate, airline,
departureAirport, arrivalAirport, departureCity, arrivalCity, totalMinimumFare, flightNumber, duration) 
VALUES 
('09:45', 'New York', '13:30', 'Los Angeles', '2024-01-01', '2024-01-01', 'American Airlines', 'JFK', 'LAX', 'New York', 'Los Angeles', 425.50, '78', '04:45:00'),
('11:30', 'Los Angeles', '15:15', 'London', '2024-01-02', '2024-01-02', 'British Airways', 'LAX', 'LHR', 'Los Angeles','London', 725.75, '234','10:45:00'),
('02:15', 'Dallas', '04:45', 'Tokyo', '2024-01-03', '2024-01-03', 'Japan Airlines', 'DFW', 'NRT', 'Dallas', 'Tokyo', 1090.00, '567', '12:30:00'),
('08:00', 'Denver', '11:45', 'Sydney', '2024-01-04', '2024-01-04', 'Qantas', 'DEN', 'SYD', 'Denver', 'Sydney', 1300.25, '890', '14:45:00'),
('04:30', 'Seattle', '06:15', 'Dubai', '2024-01-05','2024-01-05','Emirates','SEA','DXB','Seattle','Dubai',1025.50,'123','15:45:00'),
('10:30', 'Chicago', '14:00', 'Paris', '2024-01-06','2024-01-06','Air France','ORD','CDG','Chicago','Paris',865.60,'345', '08:30:00'),
('03:45', 'San Francisco', '05:30', 'Beijing','2024-01-07','2024-01-07','Air China','SFO','PEK','San Francisco','Beijing',925.40,'678','10:45:00'),
('07:15', 'Atlanta', '09:30', 'Rome', '2024-01-08', '2024-01-08','Alitalia','ATL','FCO','Atlanta','Rome',780.75,'456','08:15:00'),
('13:00', 'Houston', '15:15', 'Hong Kong', '2024-01-09', '2024-01-09','Cathay Pacific','IAH','HKG','Houston','Hong Kong',975.90,'789','15:15:00'),
('18:30', 'Miami', '20:45', 'Dublin', '2024-01-10', '2024-01-10','Aer Lingus','MIA','DUB','Miami','Dublin',620.25,'890','07:15:00');


-- VALUES 
--     ("08:00:00", "New York", "11:00:00", "Los Angeles", "Delta Airlines", "JFK", "LAX", "New York", "Los Angeles", 250.00, "New York", 0),
--     ("10:30:00", "Chicago", "14:15:00", "Miami", "American Airlines", "ORD", "MIA", "Chicago", "Miami", 300.50, "Chicago", 0),
--     ("13:45:00", "San Francisco", "16:30:00", "Seattle", "United Airlines", "SFO", "SEA", "San Francisco", "Seattle", 180.75, "San Francisco", 0),
--     ("09:15:00", "Dallas", "12:30:00", "Denver", "Southwest Airlines", "DFW", "DEN", "Dallas", "Denver", 150.25, "Dallas", 0),
--     ("07:30:00", "Los Angeles", "10:45:00", "New York", "JetBlue Airways", "LAX", "JFK", "Los Angeles", "New York", 280.00, "Los Angeles", 0),
--     ("11:20:00", "Miami", "15:05:00", "Chicago", "American Airlines", "MIA", "ORD", "Miami", "Chicago", 320.75, "Miami", 0),
--     ("14:00:00", "Seattle", "17:45:00", "San Francisco", "United Airlines", "SEA", "SFO", "Seattle", "San Francisco", 190.50, "Seattle", 0),
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

-- INSERT INTO product(product_type, name, price)
-- VALUES
--     ('hotel','Hotel del Coronado',100.00),
--     ('hotel','Arizona Inn',100.00),
--     ('hotel','Four Seasons Resort Hualalai',100.00),
--     ('hotel','Denver Marriott Tech Center',100.00),
--     ('hotel','Grand Hyatt New York',100.00),
--     ('hotel','Fontainebleau Miami Beach',100.00),
--     ('hotel','The Ritz-Carlton, Chicago',100.00),
--     ('hotel','The Ritz-Carlton, Denver',100.00),
--     ('hotel','The Ritz-Carlton',100.00),
--     ('hotel','Fairmont San Francisco',100.00),
--     ('hotel','The Joule, Dallas',100.00),
--     ('hotel','The Confidante Miami Beach',100.00),
--     ('hotel','The Langham, New York, Fifth Ave',100.00),
--     ('hotel','The Ritz-Carlton, Denver',100.00),
--     ('hotel','The Langham, Chicago',100.00),
--     ('hotel','Four Seasons Hotel Miami',100.00),
--     ('hotel','The Westin Bonaventure Hotel & S Figueroa St',100.00),
--     ('hotel','Hyatt Regency San Francisco',100.00),
--     ('hotel','The Adolphus, Autograph Collecti',100.00),
--     ('hotel','Eden Roc Miami Beach',100.00),
--     ('hotel','The Langham, New York, Fifth Avenue',100.00),
--     ('hotel','The Ritz-Carlton, Denver',100.00),
--     ('hotel','The Langham, Chicago',100.00),
--     ('hotel','Four Seasons Hotel Denver',100.00);


-- INSERT INTO hotel (id, name, areaName, starRating, addressLineOne, cityName, stateCode, countryCode, zip)
-- VALUES
    -- ('The Joule, Dallas','Downtown Dallas', 4, 'Dallas', '1530 Main St', 'TX', 'US', '75201'),
    -- ('The Confidante Miami Beach', 'Miami Beach', 4, 'Miami Beach', '4041 Collins Ave', 'FL', 'US', '33140'),
    -- ('The Langham, New York, Fifth Avenue', 'Midtown Manhattan', 5, 'New York', '400 5th Ave', 'NY', 'US', '10018'),
    -- ('The Langham, Chicago', 'River North', 4, 'Chicago','330 N Wabash Ave', 'IL', 'US', '60611'),
    -- ('Four Seasons Hotel Miami', 'Brickell', 5, 'Miami', '1435 Brickell Ave', 'FL', 'US', '33131'),
    -- ('The Westin Bonaventure Hotel & Suites, Los Angeles', 'Downtown Los Angeles', 4, 'Los Angeles', '404 S Figueroa St', 'CA', 'US', '90071'),
    -- ('Hyatt Regency San Francisco', 'Embarcadero', 4, 'San Francisco', '5 Embarcadero Center', 'CA', 'US', '94111'),
    -- ('The Adolphus, Autograph Collection', 'Downtown Dallas', 4, 'Dallas', '1321 Commerce St', 'TX', 'US', '75202'),
    -- ('Eden Roc Miami Beach', 'Miami Beach', 4, 'Miami Beach', '4525 Collins Ave', 'FL', 'US', '33140'),
    -- ('The Langham, New York, Fifth Avenue', 'Midtown Manhattan', 5, 'New York', '400 5th Ave', 'NY', 'US', '10018'),
    -- ('The Ritz-Carlton, Denver', 'Downtown Denver', 4, 'Denver', '1881 Curtis St', 'CO', 'US', '80202'),
    -- ('The Langham, Chicago', 'River North', 4, 'Chicago', '330 N Wabash Ave', 'IL', 'US', '60611'),
    -- ('Four Seasons Hotel Denver', 'Downtown Denver', 5, 'Denver', '1111 14th St', 'CO', 'US', '80202');

INSERT INTO hotels (name,areaName,starRating,cityName,addressLineOne,stateCode,countryCode,zip) 
VALUES 
('Grand Hyatt New York', 'Midtown Manhattan',4,'New York','109 E 42nd St','NY','US','10017'),
('Fontainebleau Miami Beach','Miami Beach',5,'Miami Beach','4441 Collins Ave','FL','US','33140'),
('The Ritz-Carlton, Chicago','Magnificent Mile',4,'Chicago','160 E Pearson St','IL','US','60611'),
('The Ritz-Carlton, Denver','Downtown Denver',4,'Denver','1881 Curtis St','CO','US','80202'),
('The Ritz-Carlton, Los Angeles','Downtown Los Angeles',4,'Los Angeles','900 W Olympic Blvd','CA','US','90015'),
('Fairmont San Francisco','Nob Hill',5,'San Francisco','950 Mason St','CA','US','94108'),
('The Joule, Dallas','Downtown Dallas',4,'Dallas','1530 Main St','TX','US','75201'),
('The Confidante Miami Beach','Miami Beach',4,'Miami Beach','4041 Collins Ave','FL','US','33140'),
('The Langham, New York, Fifth Avenue','Midtown Manhattan',5,'New York','400 5th Ave','NY','US','10018'),
('The Ritz-Carlton, Denver','Downtown Denver',4,'Denver','1881 Curtis St','CO','US','80202'),
('The Langham, Chicago','River North',4,'Chicago','330 N Wabash Ave','IL','US','60611'),
('Four Seasons Hotel Miami','Brickell',5,'Miami','1435 Brickell Ave','FL','US','33131'),
('The Westin Bonaventure Hotel & Suites, Los Angeles','Downtown Los Angeles',4,'Los Angeles','404 S Figueroa St','CA','US','90071'),
('Hyatt Regency San Francisco','Embarcadero',4,'San Francisco','5 Embarcadero Center','CA','US','94111'),
('The Adolphus, Autograph Collection','Downtown Dallas',4,'Dallas','1321 Commerce St','TX','US','75202'),
('Eden Roc Miami Beach','Miami Beach',4,'Miami Beach','4525 Collins Ave','FL','US','33140'),
('The Langham, New York, Fifth Avenue','Midtown Manhattan',5,'New York','400 5th Ave','NY','US','10018'),
('The Ritz-Carlton, Denver','Downtown Denver',4,'Denver','1881 Curtis St','CO','US','80202'),
('The Langham, Chicago','River North',4,'Chicago','330 N Wabash Ave','IL','US','60611'),
('Four Seasons Hotel Denver','Downtown Denver',5,'Denver','1111 14th St','CO','US','80202'),
('Hotel del Coronado', 'Coronado', 4, '1500 Orange Ave', 'Coronado', 'CA', 'USA', '92118'),
('Arizona Inn', 'Downtown Tucson', 5, '2200 E Elm St', 'Tucson', 'AZ', 'USA', '85719'),
('Four Seasons Resort Hualalai', 'Kailua-Kona', 5, '72-100 Kaupulehu Drive', 'Kailua-Kona', 'HI', 'USA', '96740'),
('Denver Marriott Tech Center', 'Downtown Denver', 4, '4900 S Syracuse St', 'Denver', 'CO', 'USA', '80237');