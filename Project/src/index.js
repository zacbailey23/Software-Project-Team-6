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
  if (query.queryType === 'flightSearchTwoWay') {
    function extractFlightInformation(data) {
      const flightsInfo = [];
      const maxFlights = 20; // Maximum number of flights to extract

      if (data.getAirFlightRoundTrip.results.result.itinerary_data) {
        const itineraries = data.getAirFlightRoundTrip.results.result.itinerary_data ?? undefined;
        const something = true ? true : false

        for (const itineraryKey in itineraries) {
          if (itineraries.hasOwnProperty(itineraryKey) && flightsInfo.length < maxFlights) {
            const itinerary = itineraries[itineraryKey];

            // Extracting the last flight from the flight_data object
            const flightDataKeys = Object.keys(itinerary.slice_data.slice_0.flight_data);
            const lastFlightKey = flightDataKeys[flightDataKeys.length - 1];
            const lastFlight = itinerary.slice_data.slice_0.flight_data[lastFlightKey];

            const flightInfo = {
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
              city: itinerary.slice_data.slice_0.departure.airport.city, // Assuming 'city' refers to the departure city
              numberOfConnections: flightDataKeys.length - 1
            };

            flightsInfo.push(flightInfo);
          }

          if (flightsInfo.length >= maxFlights) {
            break;
          }
        }
        return flightsInfo;
      }
    }
  } else if (query.queryType === 'hotelSearch') {
    const hotelsInfo = [];

    if (data && data.getHotelAutoSuggestV2 && data.getHotelAutoSuggestV2.results && data.getHotelAutoSuggestV2.results.result && data.getHotelAutoSuggestV2.results.result.hotels) {
      const hotels = data.getHotelAutoSuggestV2.results.result.hotels;

      for (const key in hotels) {
        if (hotels.hasOwnProperty(key)) {
          const hotel = hotels[key];

          const hotelInfo = {
            id: hotel.id,
            name: hotel.hotel_name,
            area_name: hotel.area_name,
            starRating: hotel.star_rating || 'Not available', // Default value if star rating is not available
            address: {
              cityName: hotel.address.city_name,
              addressLineOne: hotel.address.address_line_one,
              stateCode: hotel.address.state_code,
              countryCode: hotel.address.country_code,
              zip: hotel.address.zip
            },
          };

          hotelsInfo.push(hotelInfo);
        }
      }
    }

    return hotelsInfo;
  } else if (query.queryType === 'anotherQueryType') {
    const hotelsInfo = [];

    if (data && data.getAirFlightRoundTrip && data.getAirFlightRoundTrip.results && data.getAirFlightRoundTrip.results.result && data.getAirFlightRoundTrip.results.result.itinerary_data) {
      const itineraries = data.getAirFlightRoundTrip.results.result.itinerary_data;

      for (const itineraryKey in itineraries) {
        if (itineraries.hasOwnProperty(itineraryKey) && flightsInfo.length < maxFlights) {
          const itinerary = itineraries[itineraryKey];
          const slice = itinerary.slice_data.slice_0;

          // Extracting the last flight from the flight_data object
          const flightDataKeys = Object.keys(slice.flight_data);
          const lastFlightKey = flightDataKeys[flightDataKeys.length - 1];
          const lastFlight = slice.flight_data[lastFlightKey];

          const flightInfo = {
            departureTime: slice.departure.datetime.time_12h,
            departureLocation: slice.departure.airport.name,
            arrivalTime: lastFlight.arrival.datetime.time_12h,
            arrivalLocation: lastFlight.arrival.airport.name,
            airline: slice.airline.name,
            departureAirport: slice.departure.airport.code,
            arrivalAirport: lastFlight.arrival.airport.code,
            departureCity: slice.departure.airport.city,
            arrivalCity: lastFlight.arrival.airport.city,
            totalMinimumFare: itinerary.price_details.display_total_fare,
            city: slice.departure.airport.city,
            numberOfConnections: flightDataKeys.length - 1
          };

          flightsInfo.push(flightInfo);
        }

        if (flightsInfo.length >= maxFlights) {
          break;
        }
      }
    }
    return flightsInfo;
  }

}


const defaultData = {
  destinations: ["New York", "Paris", "Tokyo", "Sydney"],
  message: "Welcome to our travel site!"
};

async function fetchData(query) {
  let options;

  if (query.searchType === 'flightSearchTwoWay') {
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
  } else if (query.searchType === 'hotelSearch') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/hotels/autoSuggest',
      params: {
        string: query.location, // must be a city
        get_pois: 'true',
        get_hotels: 'true',
        max_results: '20'
      },
      headers: {
        'X-RapidAPI-Key': '5a8c5b6274msh26b6560c7a72ed9p136754jsn7975b4a5af44',
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
  } else if (query.searchType === 'flightSearchOneWay') {
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
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}



app.post('/search', async (req, res) => {
  const query = req.body;
  
  try {
    // Fetch data based on the query type
    const data = await fetchData(query);

    // Use extractTopHotelsAndFlights to process the data
    const topHotelsAndFlights = extractTopHotelsAndFlights(query, data);

    // Send the processed data back to the client
    res.json(topHotelsAndFlights);
  } catch (error) {
    console.error('Error processing search:', error);
    res.status(500).send('Internal Server Error');
  }
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

app.post("/cartItem/add", (req, res) => {
  const item_id = parseInt(req.body.item_id);
  db.tx(async (t) => {
    //only needed if there is something simlar to prereq
    //but for a cartItem
    // const { num_prerequisites } = await t.one(
    //   `SELECT
    //     num_prerequisites
    //    FROM
    //     course_prerequisite_count
    //    WHERE
    //     course_id = $1`,
    //   [course_id]
    // );
    // }) //this might need to go on home page where 
    //the user will see all the options and wants to add one
    //.then(() => {
    //   res.render("pages/cart", {
    //     cartItem,
    //     message: `Successfully added course ${req.body.item_id}`,
    //     action: "add",
    //   });
    try {
      await t.none(
        "INSERT INTO cartItem(item_id) VALUES (1$)",
        [item_id]
      );
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
});

app.post("/cartItem/delete", (req, res) => {
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
})
//add item 
//delete item
//

app.post("/cart", (req, res) => { })
// Authentication Required
app.use(auth);

app.get("/planner", (req, res) => {
  const query = `SELECT * FROM cartItem WHERE user_id = ${req.query.user_id}`;
  db.any(query)
    .then((cartItem) => {
      if(data) { // if the cart is not empty
        res.render("pages/planner", {cartItem});
      }
      else { // if the cart is empty
        res.render("pages/planner", {
          items: [],
          error: true,
          message: "You have not purchased any items. Purchase an item to view it here.",
        });
      }
    })
    .catch((err) => {
      res.render("pages/planner", {
        items: [],
        error: true,
        message: "Error loading cart information.",
      });
    });
});


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');