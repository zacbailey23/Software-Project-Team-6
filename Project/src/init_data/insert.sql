-- INSERT INTO users (username, password) VALUES ($1,$2);
INSERT INTO cars(year, make, model, price, car_id)
VALUES
    (2020, 'Subaru', 'Outback', 200, 1),
    (2019, 'Toyota', 'Pirus', 200, 2),
    (2021, 'Toyota', 'Corolla', 200, 3),
    (2017, 'Honda', 'Civic', 200, 4),
    (2002, 'Honda', 'Accord', 200, 5);

INSERT INTO users (username, password)
VALUES ('audra', 'test'),