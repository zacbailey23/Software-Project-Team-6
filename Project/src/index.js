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
  }
  return []; // Return an empty array if no data matches the query type
}


async function fetchData(query) {
  let options;

  if (query.queryType === 'flightSearchTwoWay') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/flight/roundTrip',
      params: {
        sid: 'iSiX639',
        adults: '1',
        departure_date: query.departureDate,
        destination_airport_code: query.destination,
        cabin_class: query.cabinClass,
        origin_airport_code: query.origin,
        number_of_itineraries: '21',
        currency: 'USD'
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
  } 
  try {
    const response = await axios.request(options);
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
  // Render the EJS template with the extracted  data
  res.render('pages/searchResults', { data: templateData, userLoggedIn: req.session.isLoggedIn || false});
});


app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {

  res.redirect('/homepage');
});

app.get('/homepage', (req, res) => {
  // Check if the session and user exist
  const flightInfoArray = [
    {
      flight_id: 1,
      departureTime: "08:00:00",
      departureLocation: "New York",
      arrivalTime: "11:00:00",
      arrivalLocation: "Los Angeles",
      airline: "Delta Airlines",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      departureCity: "New York",
      arrivalCity: "Los Angeles",
      totalMinimumFare: 250.00,
      city: "New York",
      numberOfConnections: 0,
      ifCarorFlightorHotel: "flight"
    },
    {
      flight_id: 2,
      departureTime: "10:30:00",
      departureLocation: "Chicago",
      arrivalTime: "14:15:00",
      arrivalLocation: "Miami",
      airline: "American Airlines",
      departureAirport: "ORD",
      arrivalAirport: "MIA",
      departureCity: "Chicago",
      arrivalCity: "Miami",
      totalMinimumFare: 300.50,
      city: "Chicago",
      numberOfConnections: 0,
    },
    {
      flight_id: 3,
      departureTime: "13:45:00",
      departureLocation: "San Francisco",
      arrivalTime: "16:30:00",
      arrivalLocation: "Seattle",
      airline: "United Airlines",
      departureAirport: "SFO",
      arrivalAirport: "SEA",
      departureCity: "San Francisco",
      arrivalCity: "Seattle",
      totalMinimumFare: 180.75,
      city: "San Francisco",
      numberOfConnections: 0,
    },
    {
      flight_id: 4,
      departureTime: "09:15:00",
      departureLocation: "Dallas",
      arrivalTime: "12:30:00",
      arrivalLocation: "Denver",
      airline: "Southwest Airlines",
      departureAirport: "DFW",
      arrivalAirport: "DEN",
      departureCity: "Dallas",
      arrivalCity: "Denver",
      totalMinimumFare: 150.25,
      city: "Dallas",
      numberOfConnections: 0,
    },
    {
      flight_id: 5,
      departureTime: "07:30:00",
      departureLocation: "Los Angeles",
      arrivalTime: "10:45:00",
      arrivalLocation: "New York",
      airline: "JetBlue Airways",
      departureAirport: "LAX",
      arrivalAirport: "JFK",
      departureCity: "Los Angeles",
      arrivalCity: "New York",
      totalMinimumFare: 280.00,
      city: "Los Angeles",
      numberOfConnections: 0,
    },
    {
      flight_id: 6,
      departureTime: "11:20:00",
      departureLocation: "Miami",
      arrivalTime: "15:05:00",
      arrivalLocation: "Chicago",
      airline: "American Airlines",
      departureAirport: "MIA",
      arrivalAirport: "ORD",
      departureCity: "Miami",
      arrivalCity: "Chicago",
      totalMinimumFare: 320.75,
      city: "Miami",
      numberOfConnections: 0,
    },
    {
      flight_id: 7,
      departureTime: "14:00:00",
      departureLocation: "Seattle",
      arrivalTime: "17:45:00",
      arrivalLocation: "San Francisco",
      airline: "United Airlines",
      departureAirport: "SEA",
      arrivalAirport: "SFO",
      departureCity: "Seattle",
      arrivalCity: "San Francisco",
      totalMinimumFare: 190.50,
      city: "Seattle",
      numberOfConnections: 0,
    },
    {
      flight_id: 8,
      departureTime: "08:45:00",
      departureLocation: "Denver",
      arrivalTime: "12:00:00",
      arrivalLocation: "Dallas",
      airline: "Southwest Airlines",
      departureAirport: "DEN",
      arrivalAirport: "DFW",
      departureCity: "Denver",
      arrivalCity: "Dallas",
      totalMinimumFare: 160.75,
      city: "Denver",
      numberOfConnections: 0,
    },
    {
      flight_id: 9,
      departureTime: "07:15:00",
      departureLocation: "New York",
      arrivalTime: "10:15:00",
      arrivalLocation: "Los Angeles",
      airline: "Delta Airlines",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      departureCity: "New York",
      arrivalCity: "Los Angeles",
      totalMinimumFare: 265.50,
      city: "New York",
      numberOfConnections: 0,
    },
    {
      flight_id: 10,
      departureTime: "09:45:00",
      departureLocation: "Chicago",
      arrivalTime: "13:30:00",
      arrivalLocation: "Miami",
      airline: "American Airlines",
      departureAirport: "ORD",
      arrivalAirport: "MIA",
      departureCity: "Chicago",
      arrivalCity: "Miami",
      totalMinimumFare: 310.25,
      city: "Chicago",
      numberOfConnections: 0,
    },
    {
      flight_id: 11,
      departureTime: "12:30:00",
      departureLocation: "San Francisco",
      arrivalTime: "15:15:00",
      arrivalLocation: "Seattle",
      airline: "United Airlines",
      departureAirport: "SFO",
      arrivalAirport: "SEA",
      departureCity: "San Francisco",
      arrivalCity: "Seattle",
      totalMinimumFare: 195.00,
      city: "San Francisco",
      numberOfConnections: 0,
    },
    {
      flight_id: 12,
      departureTime: "10:00:00",
      departureLocation: "Dallas",
      arrivalTime: "13:15:00",
      arrivalLocation: "Denver",
      airline: "Southwest Airlines",
      departureAirport: "DFW",
      arrivalAirport: "DEN",
      departureCity: "Dallas",
      arrivalCity: "Denver",
      totalMinimumFare: 155.25,
      city: "Dallas",
      numberOfConnections: 0,
    },
    {
      flight_id: 13,
      departureTime: "08:30:00",
      departureLocation: "Los Angeles",
      arrivalTime: "11:45:00",
      arrivalLocation: "New York",
      airline: "JetBlue Airways",
      departureAirport: "LAX",
      arrivalAirport: "JFK",
      departureCity: "Los Angeles",
      arrivalCity: "New York",
      totalMinimumFare: 275.00,
      city: "Los Angeles",
      numberOfConnections: 0,
    },
    {
      flight_id: 14,
      departureTime: "11:45:00",
      departureLocation: "Miami",
      arrivalTime: "15:30:00",
      arrivalLocation: "Chicago",
      airline: "American Airlines",
      departureAirport: "MIA",
      arrivalAirport: "ORD",
      departureCity: "Miami",
      arrivalCity: "Chicago",
      totalMinimumFare: 315.75,
      city: "Miami",
      numberOfConnections: 0,
    },
    {
      flight_id: 15,
      departureTime: "14:30:00",
      departureLocation: "Seattle",
      arrivalTime: "18:15:00",
      arrivalLocation: "San Francisco",
      airline: "United Airlines",
      departureAirport: "SEA",
      arrivalAirport: "SFO",
      departureCity: "Seattle",
      arrivalCity: "San Francisco",
      totalMinimumFare: 200.50,
      city: "Seattle",
      numberOfConnections: 0,
    },
    {
      flight_id: 16,
      departureTime: "09:45:00",
      departureLocation: "Denver",
      arrivalTime: "13:00:00",
      arrivalLocation: "Dallas",
      airline: "Southwest Airlines",
      departureAirport: "DEN",
      arrivalAirport: "DFW",
      departureCity: "Denver",
      arrivalCity: "Dallas",
      totalMinimumFare: 165.75,
      city: "Denver",
      numberOfConnections: 0,
    },
    {
      flight_id: 17,
      departureTime: "08:15:00",
      departureLocation: "New York",
      arrivalTime: "11:15:00",
      arrivalLocation: "Los Angeles",
      airline: "Delta Airlines",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      departureCity: "New York",
      arrivalCity: "Los Angeles",
      totalMinimumFare: 260.50,
      city: "New York",
      numberOfConnections: 0,
    },
    {
      flight_id: 18,
      departureTime: "10:30:00",
      departureLocation: "Chicago",
      arrivalTime: "14:15:00",
      arrivalLocation: "Miami",
      airline: "American Airlines",
      departureAirport: "ORD",
      arrivalAirport: "MIA",
      departureCity: "Chicago",
      arrivalCity: "Miami",
      totalMinimumFare: 305.25,
      city: "Chicago",
      numberOfConnections: 0,
    },
    {
      flight_id: 19,
      departureTime: "13:15:00",
      departureLocation: "San Francisco",
      arrivalTime: "16:00:00",
      arrivalLocation: "Seattle",
      airline: "United Airlines",
      departureAirport: "SFO",
      arrivalAirport: "SEA",
      departureCity: "San Francisco",
      arrivalCity: "Seattle",
      totalMinimumFare: 185.00,
      city: "San Francisco",
      numberOfConnections: 0,
    },
    {
      flight_id: 20,
      departureTime: "11:00:00",
      departureLocation: "Dallas",
      arrivalTime: "14:15:00",
      arrivalLocation: "Denver",
      airline: "Southwest Airlines",
      departureAirport: "DFW",
      arrivalAirport: "DEN",
      departureCity: "Dallas",
      arrivalCity: "Denver",
      totalMinimumFare: 155.50,
      city: "Dallas",
      numberOfConnections: 0,
    },
  ];
  const hotelInfoArray = [
    {
      id: 1,
      name: "Grand Hyatt New York",
      areaName: "Midtown Manhattan",
      starRating: 4,
      address: {
        cityName: "New York",
        addressLineOne: "109 E 42nd St",
        stateCode: "NY",
        countryCode: "US",
        zip: "10017"
      },
    },
    {
      id: 2,
      name: "Fontainebleau Miami Beach",
      areaName: "Miami Beach",
      starRating: 5,
      address: {
        cityName: "Miami Beach",
        addressLineOne: "4441 Collins Ave",
        stateCode: "FL",
        countryCode: "US",
        zip: "33140"
      },
    },
    {
      id: 3,
      name: "The Ritz-Carlton, Chicago",
      areaName: "Magnificent Mile",
      starRating: 4,
      address: {
        cityName: "Chicago",
        addressLineOne: "160 E Pearson St",
        stateCode: "IL",
        countryCode: "US",
        zip: "60611"
      },
    },
    {
      id: 4,
      name: "The Ritz-Carlton, Denver",
      areaName: "Downtown Denver",
      starRating: 4,
      address: {
        cityName: "Denver",
        addressLineOne: "1881 Curtis St",
        stateCode: "CO",
        countryCode: "US",
        zip: "80202"
      },
    },
    {
      id: 5,
      name: "The Ritz-Carlton, Los Angeles",
      areaName: "Downtown Los Angeles",
      starRating: 4,
      address: {
        cityName: "Los Angeles",
        addressLineOne: "900 W Olympic Blvd",
        stateCode: "CA",
        countryCode: "US",
        zip: "90015"
      },
    },
    {
      id: 6,
      name: "Fairmont San Francisco",
      areaName: "Nob Hill",
      starRating: 5,
      address: {
        cityName: "San Francisco",
        addressLineOne: "950 Mason St",
        stateCode: "CA",
        countryCode: "US",
        zip: "94108"
      },
    },
    {
      id: 7,
      name: "The Joule, Dallas",
      areaName: "Downtown Dallas",
      starRating: 4,
      address: {
        cityName: "Dallas",
        addressLineOne: "1530 Main St",
        stateCode: "TX",
        countryCode: "US",
        zip: "75201"
      },
    },
    {
      id: 8,
      name: "The Confidante Miami Beach",
      areaName: "Miami Beach",
      starRating: 4,
      address: {
        cityName: "Miami Beach",
        addressLineOne: "4041 Collins Ave",
        stateCode: "FL",
        countryCode: "US",
        zip: "33140"
      },
    },
    {
      id: 9,
      name: "The Langham, New York, Fifth Avenue",
      areaName: "Midtown Manhattan",
      starRating: 5,
      address: {
        cityName: "New York",
        addressLineOne: "400 5th Ave",
        stateCode: "NY",
        countryCode: "US",
        zip: "10018"
      },
    },
    {
      id: 10,
      name: "The Ritz-Carlton, Denver",
      areaName: "Downtown Denver",
      starRating: 4,
      address: {
        cityName: "Denver",
        addressLineOne: "1881 Curtis St",
        stateCode: "CO",
        countryCode: "US",
        zip: "80202"
      },
    },
    {
      id: 11,
      name: "The Langham, Chicago",
      areaName: "River North",
      starRating: 4,
      address: {
        cityName: "Chicago",
        addressLineOne: "330 N Wabash Ave",
        stateCode: "IL",
        countryCode: "US",
        zip: "60611"
      },
    },
    {
      id: 12,
      name: "Four Seasons Hotel Miami",
      areaName: "Brickell",
      starRating: 5,
      address: {
        cityName: "Miami",
        addressLineOne: "1435 Brickell Ave",
        stateCode: "FL",
        countryCode: "US",
        zip: "33131"
      },
    },
    {
      id: 13,
      name: "The Westin Bonaventure Hotel & Suites, Los Angeles",
      areaName: "Downtown Los Angeles",
      starRating: 4,
      address: {
        cityName: "Los Angeles",
        addressLineOne: "404 S Figueroa St",
        stateCode: "CA",
        countryCode: "US",
        zip: "90071"
      },
    },
    {
      id: 14,
      name: "Hyatt Regency San Francisco",
      areaName: "Embarcadero",
      starRating: 4,
      address: {
        cityName: "San Francisco",
        addressLineOne: "5 Embarcadero Center",
        stateCode: "CA",
        countryCode: "US",
        zip: "94111"
      },
    },
    {
      id: 15,
      name: "The Adolphus, Autograph Collection",
      areaName: "Downtown Dallas",
      starRating: 4,
      address: {
        cityName: "Dallas",
        addressLineOne: "1321 Commerce St",
        stateCode: "TX",
        countryCode: "US",
        zip: "75202"
      },
    },
    {
      id: 16,
      name: "Eden Roc Miami Beach",
      areaName: "Miami Beach",
      starRating: 4,
      address: {
        cityName: "Miami Beach",
        addressLineOne: "4525 Collins Ave",
        stateCode: "FL",
        countryCode: "US",
        zip: "33140"
      },
    },
    {
      id: 17,
      name: "The Langham, New York, Fifth Avenue",
      areaName: "Midtown Manhattan",
      starRating: 5,
      address: {
        cityName: "New York",
        addressLineOne: "400 5th Ave",
        stateCode: "NY",
        countryCode: "US",
        zip: "10018"
      },
    },
    {
      id: 18,
      name: "The Ritz-Carlton, Denver",
      areaName: "Downtown Denver",
      starRating: 4,
      address: {
        cityName: "Denver",
        addressLineOne: "1881 Curtis St",
        stateCode: "CO",
        countryCode: "US",
        zip: "80202"
      },
    },
    {
      id: 19,
      name: "The Langham, Chicago",
      areaName: "River North",
      starRating: 4,
      address: {
        cityName: "Chicago",
        addressLineOne: "330 N Wabash Ave",
        stateCode: "IL",
        countryCode: "US",
        zip: "60611"
      },
    },
    {
      id: 20,
      name: "Four Seasons Hotel Denver",
      areaName: "Downtown Denver",
      starRating: 5,
      address: {
        cityName: "Denver",
        addressLineOne: "1111 14th St",
        stateCode: "CO",
        countryCode: "US",
        zip: "80202"
      },
    },
  ];
  
  if(req.session && req.session.user) {
    res.render('pages/homepage', { user: req.session.user, flights: flightInfoArray || [], hotels: hotelInfoArray || [] });
  } else {
    // Handle the case where the session or user is not set
    res.render('pages/homepage', { user: null, flights: flightInfoArray, hotels: hotelInfoArray});
  }
});

app.get('/register', (req, res) => {
  res.render('pages/register');
});
app.post('/register', async (req, res) => {
  try {
    // Check if username already exists
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

    if (existingUser) {
      // Username already exists
      res.render('pages/register', { message: 'Username already exists. Please choose a different one.' });
      return;
    }

    // Hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    await db.none(query, [req.body.username, hash]);
    res.redirect('/login');

  } catch (error) {
    console.error('Error during registration:', error);
    res.render('pages/register', { message: 'Error during registration. Please try again.' });
  }
});


// app.post('/register', async (req, res) => {
//   try {
//     const hash = await bcrypt.hash(req.body.password, 10);
//     // Include the new fields in the query
//     const query = `
//       INSERT INTO users (username, password, first_name, last_name, date_of_birth, location)
//       VALUES ($1, $2, $3, $4, $5, $6)
//     `;
//     await db.none(query, [
//       req.body.username, 
//       hash, 
//       req.body.first_name,
//       req.body.last_name,
//       req.body.date_of_birth,
//       req.body.location
//     ]);
//     res.redirect('/login');
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.redirect('/register');
//   }
// });

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);

    // Check if user exists
    if (!user) {
      res.render('pages/login', { message: 'Incorrect username or password.' });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      res.render('pages/login', { message: 'Incorrect username or password.' });
      return;
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      if (err) {
        throw err;
      }
      res.redirect('/homepage');
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.render('pages/login', { message: 'Login failed. Please try again.' });
  }
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/login');
});

app.get('/cartItem', (req, res) => {
  if(req.session && req.session.user) {
    res.render('pages/cart', { user: req.session.user});
  } else {
    // Handle the case where the session or user is not set
    res.render('pages/cart', { user: null});
  }
});

app.post('/submitFlightData', async (req, res) => {
  try {
      const flightData = JSON.parse(req.body.flightData);
      
      // Insert data into flightsReturned table
      const flightInsertQuery = 'INSERT INTO flightsReturned (departureTime, departureLocation, arrivalTime, arrivalLocation, airline, departureAirport, arrivalAirport, departureCity, arrivalCity, totalMinimumFare, city, numberOfConnections) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING flight_id;';
      const flightValues = [flightData.departureTime, flightData.departureLocation, flightData.arrivalTime, flightData.arrivalLocation, flightData.airline, flightData.departureAirport, flightData.arrivalAirport, flightData.departureCity, flightData.arrivalCity, flightData.totalMinimumFare, flightData.city, flightData.numberOfConnections];
      
      // const flightInsertResult = await db.one(flightInsertQuery, flightValues);

      //we currently do not have a method of assigning a user id to the user upon registering
      // const userId =
      // const flightId = flightInsertResult.flight_id;

      // // Insert data into cartItem table
      // const cartInsertQuery = 'INSERT INTO cartItem (user_id, flight_id) VALUES ($1, $2);';
      // const cartValues = [userId, flightId];
      // await db.none(cartInsertQuery, cartValues);
      res.send('Flight data submitted successfully');
      //res.redirect('pages/cartItem') do we want it to redirect to the home or cart page or something
  } catch (err) {
     console.error('Error in submitting flight data', err);
     res.status(500).send('Error in submitting flight data');

  }
});

// Similar changes should be made to /submitHotelData

app.post('/submitHotelData', async (req, res) => {
  try {
      const hotelData = JSON.parse(req.body.hotelData);
      
      // Extract address details from the nested structure
      const { cityName, addressLineOne, stateCode, countryCode, zip } = hotelData.address;

      // Insert data into hotels table
      const hotelInsertQuery = 'INSERT INTO hotels (name, areaName, starRating, addressLineOne, cityName, stateCode, countryCode, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING hotel_id;';
      const hotelValues = [hotelData.name, hotelData.areaName, hotelData.starRating, addressLineOne, cityName, stateCode, countryCode, zip];
      const hotelInsertResult = await db.one(hotelInsertQuery, hotelValues);

      //we currently do not have a method of assigning a user id to the user upon registering
      // const userId =
      // const hotelId = hotelInsertResult.hotel_id;

      // // Insert data into cartItem table
      // const cartInsertQuery = 'INSERT INTO cartItem (user_id, hotel_id) VALUES ($1, $2);';
      // const cartValues = [userId, hotelId];
      // await db.none(cartInsertQuery, cartValues);

      res.send('Hotel data submitted successfully');
  } catch (err) {
      console.error('Error in submitting hotel data', err);
      res.status(500).send('Error in submitting hotel data');
  }
});

// add to cart {id, title, price, ifCarorFlightorHotel}
// table cartitem {id, title, price, ifCarorFlightorHotel}
// want info if(ifCarorFlightorHotel === car ) innerjoin with car using 

app.post('/plannerItem/add', async (req, res) => {
  const planner = parseInt(req.body.id);
  if(){
    db.one("INSERT INTO planner() VALUES (1$)", [item_id]);
  }
  db.one("INSERT INTO cartItem() VALUES (1$)", [item_id]);
  try {
    res.render('pages/cartItem', {
      cartItem: req.body.item_id, // Pass the added item to the cart for rendering purposes
      message: `Successfully added item ${req.body.item_id} to cart`,
      action:'add',
    });
  } catch (err) {
    res.render("pages/homepage", {
      item: [],
      error: true,
      message: err.message,
    });
  }
});


app.post('/cartItem/delete', (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const query = ("DELETE cartItem(item_id) VALUES (1$)", [item_id]);
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
    const user_id = await db.one(`SELECT user_id FROM users WHERE username = ${req.session.username}`);
    const query = `SELECT * FROM cartItem WHERE cartItem.user_id = $1;`;

    let planner = await db.any(query, user_id);
    if (planner[0]) {
      res.render("pages/planner", planner);
    }
    else {
      const errorMessage = "You have not purchased any items. Purchase an item to view it here.";
      res.redirect(`/planner?error=${encodeURIComponent(errorMessage)}`);
    }
  } catch (error) {
    const errorMessage = "Error loading planner.";
    res.redirect(`/homepage?error=${encodeURIComponent(errorMessage)}`);
  }
});


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');