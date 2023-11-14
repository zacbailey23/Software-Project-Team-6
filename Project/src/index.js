// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.
const path = require('path');
// app.set('views', path.join(__dirname, 'views'));

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

const defaultData = {
  destinations: ["New York", "Paris", "Tokyo", "Sydney"],
  message: "Welcome to our travel site!"
};

async function fetchData(query) {
  let options;

  if (query.queryType === 'flightSearchTwoWay') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/community/v1/flights/search',
      params: {
        location_arrival: query.destination,
        sort_order: 'PRICE',
        date_departure: query.departureDate,
        itinerary_type: 'ROUND_TRIP',
        class_type: query.class,
        location_departure: query.origin,
        date_departure_return: query.returnDate
      },
      headers: {
        'X-RapidAPI-Key': '5a8c5b6274msh26b6560c7a72ed9p136754jsn7975b4a5af44',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
  } else if (query.queryType === 'hotelSearch') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/hotels/autoSuggest',
      params: {
        string: query.location, // Assuming 'query' has a 'location' property
        get_airports: 'true',
        combine_regions: 'true',
        get_pois: 'true',
        get_regions: 'true',
        get_cities: 'true',
        show_all_cities: 'true',
        get_hotels: 'true'
      },
      headers: {
        'X-RapidAPI-Key': '5a8c5b6274msh26b6560c7a72ed9p136754jsn7975b4a5af44',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
  } else if (query.queryType === 'flightSearchOneWay') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/hotels/autoSuggest',
      params: {
        adults: '1',
        sid: 'iSiX639',
        departure_date: query.date,
        origin_airport_code: query.origin,
        destination_airport_code: query.destination
      },
      headers: {
        'X-RapidAPI-Key': '5a8c5b6274msh26b6560c7a72ed9p136754jsn7975b4a5af44',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
  }

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

app.get('/homepage', async (req, res) => {
  // Example of a default query for a flight search
  const defaultQuery = {
    queryType: 'flightSearch',
    destination: 'LAX',  // Destination airport code
    origin: 'NYC',       // Origin airport code
    departureDate: '2024-02-11', // Example departure date
    returnDate: '2024-02-15',    // Example return date
  };

  const data = await fetchData(defaultQuery);
  const topHotelsAndFlights = extractTopHotelsAndFlights(data);

  res.render('/pages/homepage', { data: topHotelsAndFlights });
});
app.post('/search', async (req, res) => {
  const query = req.body.destination;
  const data = await fetchData(query);
  const topHotelsAndFlights = extractTopHotelsAndFlights(data);

  res.render('/homepage', { data: topHotelsAndFlights  });
});

app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

app.get('/', (req, res) => {
  res.redirect('pages/home');
});
app.get('/home', (req, res) => {
  res.render('pages/home');
});
app.get('/register', (req, res) => {
  res.render('pages/register');
});

// POST /register route
app.post('/register', async (req, res) => {
  try {
    // Hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await db.none(query, [req.body.username, hash]);
    res.redirect('/login');

  } catch (error) {
    console.error('Error during registration:', error);
    res.redirect('/register');
  }
});


app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.get("/cart", (req,res) => {
  res.render('pages/cart');
});

app.post('/login', async (req, res) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

    if (!user) {
      res.redirect('/register');
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      res.render('pages/login', { error: 'Incorrect username or password.' });
      return;
    }
    req.session.user = user;
    req.session.save();

    res.redirect('/home');
  } catch (error) {
    console.error('Error during login:', error);
    res.render('pages/login', { error: 'An error occurred. Please try again.' });
  }
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("pages/login");
});
// Authentication Required
app.use(auth);
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');