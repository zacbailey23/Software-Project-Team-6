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

app.use(express.static(__dirname + '/resources'));



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
function extractTopHotelsAndFlights(query, data) {
  const maxFlights = 20; // Move this constant outside of the sub-functions as it's used in multiple places

  // Function to extract flight information
  function extractFlightInformation(itineraries) {
    return Object.values(itineraries)
      .slice(0, maxFlights)
      .map(itinerary => {
        const flightDataKeys = Object.keys(itinerary.slice_data.slice_0.flight_data);
        const lastFlightKey = flightDataKeys[flightDataKeys.length - 1];
        const lastFlight = itinerary.slice_data.slice_0.flight_data[lastFlightKey];

        return {
          departureTime: itinerary.slice_data.slice_0.departure.datetime.time_24h,
          departureLocation: itinerary.slice_data.slice_0.departure.airport.name,
          arrivalTime: lastFlight.arrival.datetime.time_12h,
          arrivalLocation: lastFlight.arrival.airport.name,
          airline: itinerary.slice_data.slice_0.airline.name,
          departureAirport: itinerary.slice_data.slice_0.departure.airport.code,
          arrivalAirport: lastFlight.arrival.airport.code,
          departureCity: itinerary.slice_data.slice_0.departure.airport.city,
          arrivalCity: lastFlight.arrival.airport.city,
          totalMinimumFare: itinerary.price_details.display_total_fare,
          numberOfConnections: flightDataKeys.length - 1
        };
      });
  }

  // Function to extract hotel information
  function extractHotelInformation(hotelsData) {
    let hotels = [];
    for (let key in hotelsData) {
      if (hotelsData.hasOwnProperty(key)) {
        let hotel = hotelsData[key];
        hotels.push({
          id: hotel.id,
          name: hotel.hotel_name,
          areaName: hotel.area_name,
          starRating: hotel.star_rating || 'Not available',
          address: {
            cityName: hotel.address.city_name,
            addressLineOne: hotel.address.address_line_one,
            stateCode: hotel.address.state_code,
            countryCode: hotel.address.country_code,
            zip: hotel.address.zip
          },
          // Include any other relevant fields
        });
      }
    }
    return hotels;
  }

  // Handle different query types
  if (query.queryType === 'flightSearchTwoWay') {
    const itineraries = data?.getAirFlightRoundTrip?.results?.result?.itinerary_data;
    if (itineraries) {
      return extractFlightInformation(itineraries);
    }
  } else if (query.queryType === 'hotelSearch') {
    const hotelsData = data?.getHotelAutoSuggestV2?.results?.result?.hotels;
    if (hotelsData) {
      return extractHotelInformation(hotelsData);
    }
  } else if (query.queryType === 'anotherQueryType') {
    // Similar logic for another query type can be added here
  }

  return []; // Return an empty array if no data matches the query type
}

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
        location_arrival: query.destination, //airport code
        sort_order: 'PRICE',
        date_departure: query.departureDate, // YYYY-MM-DD
        itinerary_type: 'ROUND_TRIP',
        class_type: query.class, // options are: economy, premium, business, first
        location_departure: query.origin, //airport code
        date_departure_return: query.returnDate // YYYY-MM-DD
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
        string: query.location, // must be a city
        get_hotels: 'true',
        max_results: '21'
      },
      headers: {
        'X-RapidAPI-Key': '5a8c5b6274msh26b6560c7a72ed9p136754jsn7975b4a5af44',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
  } else if (query.queryType === 'flightSearchOneWay') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/flight/departures',
      params: {
        adults: '1',
        sid: 'iSiX639',
        departure_date: query.date, // YYYY-MM-DD
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
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

app.get('/search', async (req, res) => {
  // Assume req.query contains your query parameters
  let query = req.query;

  // Sample data structure - this should be replaced with your actual data retrieval logic
  let data = await fetchData(query);

  // Use the extractTopHotelsAndFlights function to process the data
  let results = extractTopHotelsAndFlights(query, data);
  console.log('Processed Results:', results);

  // Prepare the data to be passed to the EJS template
  let templateData = {
      hotelsInfo: [],
      flightsInfo: []
  };

  if (query.queryType === 'hotelSearch') {
      templateData.hotelsInfo = results;
  } else if (query.queryType === 'flightSearchTwoWay') {
      templateData.flightsInfo = results;
  }
  // Handle other query types similarly

  // Render the EJS template with the extracted data
  res.render('pages/searchResults', { data: templateData });
});


app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
  res.redirect('/homepage');
});
app.get('/homepage', (req, res) => {
   res.render('pages/homepage');
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


app.post('/login', async (req, res) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      res.render('pages/login', { error: 'Incorrect username or password.' });
      return;
    }
    req.session.user = user;
    req.session.save();

    res.redirect('/homepage');
  } catch (error) {
    console.error('Error during login:', error);
    res.render('pages/login', { message: 'Incorrect Username or Password! Please try again.' });
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

app.get("/cartItem", (req, res) => {
  res.render('pages/cart');
});

app.post("/cartItem/add", async (req, res) => {
  const item_id = parseInt(req.body.item_id);
  db.one("INSERT INTO cartItem(item_id) VALUES (1$)",[item_id]);
    try {
      res.render("pages/cartItem", {
      cartItem: req.body.item_id, // Pass the added item to the cart for rendering purposes
      message: `Successfully added item ${req.body.item_id} to cart`,
      action: "add",
      });
    } catch (err) {
      res.render("pages/homepage", {
        item: [],
        error: true,
        message: err.message,
      });
    }
});


app.post("/cartItem/delete", (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const query = ("DELETE cartItem(item_id) VALUES (1$)",[item_id]);
  db.any(del);
    try {
      res.render("pages/cartItem", {
        cartItem: req.body.item_id, // Pass the added item to the cart for rendering purposes
        message: `Successfully added item ${req.body.item_id} to cart`,
        action: "add",
      });
    } catch (err) {
      res.render("pages/homepage", {
        item: [],
        error: true,
        message: err.message,
      });
    }
})
//add item 
//delete item
//

app.post("/cart", (req, res) => { })
// Authentication Required
app.use(auth);

app.get("/planner", async (req, res) => {
    try {
      const query = `SELECT * FROM cartItem WHERE cartItem.user_id = $1;`;
    
      const planner = await db.one(query, req.body.users.user_id);
      if(planner) {
        res.render("pages/planner", data);
      }
      else {
        const errorMessage = "You have not purchased any items. Purchase an item to view it here.";
        res.redirect(`/planner?error=${encodeURIComponent(errorMessage)}`);
      }
    } catch (error) {
      const errorMessage = "Error loading planner.";
      res.redirect(`/planner?error=${encodeURIComponent(errorMessage)}`);
    }
});


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');