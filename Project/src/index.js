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
  const maxFlights = 50; // Move this constant outside of the sub-functions as it's used in multiple places

  // Function to extract flight information
  function extractFlightInformation(itineraries) {
    return Object.values(itineraries)
      .slice(0, maxFlights)
      .filter(itinerary => {
        // Filter for direct flights with no connections
        return Object.keys(itinerary.slice_data.slice_0.flight_data).length === 1;
      })
      .map(itinerary => {
        const firstFlight = itinerary.slice_data.slice_0.flight_data['flight_0'];
  
        // Extracting baggage allowances
        let baggageAllowances = firstFlight.baggage_allowances.map(baggage => {
          return {
            type: baggage.type, // e.g., "CHECKED", "CARRY_ON"
            quantity: baggage.quantity,
            restrictions: baggage.restrictions // This might contain size, weight limits, etc.
          };
        });
  
        return {
          departureTime: itinerary.slice_data.slice_0.departure.datetime.time_12h,
          departureDate: itinerary.slice_data.slice_0.departure.datetime.date,
          departureLocation: itinerary.slice_data.slice_0.departure.airport.name,
          arrivalTime: firstFlight.arrival.datetime.time_12h,
          arrivalDate: firstFlight.arrival.datetime.date,
          arrivalLocation: firstFlight.arrival.airport.name,
          airline: itinerary.slice_data.slice_0.airline.name,
          departureAirport: itinerary.slice_data.slice_0.departure.airport.code,
          arrivalAirport: firstFlight.arrival.airport.code,
          departureCity: itinerary.slice_data.slice_0.departure.airport.city,
          arrivalCity: firstFlight.arrival.airport.city,
          totalMinimumFare: itinerary.price_details.display_total_fare,
          flightNumber: firstFlight.info.flight_number,
          duration: firstFlight.info.duration,
          baggageAllowance: baggageAllowances
          
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
        number_of_itineraries: '50',
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
        max_results: '30'
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
  if(req.session && req.session.user) {
    res.render('pages/searchResults', { data: templateData, user: req.session.user});
  } else {
    // Handle the case where the session or user is not set
    res.render('pages/searchResults', { data: templateData, user: null});
  }
});


app.get('/searchInternet', (req, res) => {
  const searchQuery = req.query.searchQuery;
  if (!searchQuery) {
      return res.status(400).send('A search query is required.');
  }

  // Construct the Google search URL
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  // Redirect the user to the Google search page
  res.redirect(googleSearchUrl);
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
      departureTime: "09:45",
      departureLocation: "New York",
      arrivalTime: "13:30",
      arrivalLocation: "Los Angeles",
      arrivalDate: "2024-01-01",
      departureDate: "2024-01-01",
      airline: "American Airlines",
      departureAirport: "JFK",
      arrivalAirport: "LAX",
      departureCity: "New York",
      arrivalCity: "Los Angeles",
      totalMinimumFare: 425.50,
      flightNumber: "78",
      duration: "04:45:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "50 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "11:30",
      departureLocation: "Los Angeles",
      arrivalTime: "15:15",
      arrivalLocation: "London",
      arrivalDate: "2024-01-02",
      departureDate: "2024-01-02",
      airline: "British Airways",
      departureAirport: "LAX",
      arrivalAirport: "LHR",
      departureCity: "Los Angeles",
      arrivalCity: "London",
      totalMinimumFare: 725.75,
      flightNumber: "234",
      duration: "10:45:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "70 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "02:15",
      departureLocation: "Dallas",
      arrivalTime: "04:45",
      arrivalLocation: "Tokyo",
      arrivalDate: "2024-01-03",
      departureDate: "2024-01-03",
      airline: "Japan Airlines",
      departureAirport: "DFW",
      arrivalAirport: "NRT",
      departureCity: "Dallas",
      arrivalCity: "Tokyo",
      totalMinimumFare: 1090.00,
      flightNumber: "567",
      duration: "12:30:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "55 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "08:00",
      departureLocation: "Denver",
      arrivalTime: "11:45",
      arrivalLocation: "Sydney",
      arrivalDate: "2024-01-04",
      departureDate: "2024-01-04",
      airline: "Qantas",
      departureAirport: "DEN",
      arrivalAirport: "SYD",
      departureCity: "Denver",
      arrivalCity: "Sydney",
      totalMinimumFare: 1300.25,
      flightNumber: "890",
      duration: "14:45:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "70 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "04:30",
      departureLocation: "Seattle",
      arrivalTime: "06:15",
      arrivalLocation: "Dubai",
      arrivalDate: "2024-01-05",
      departureDate: "2024-01-05",
      airline: "Emirates",
      departureAirport: "SEA",
      arrivalAirport: "DXB",
      departureCity: "Seattle",
      arrivalCity: "Dubai",
      totalMinimumFare: 1025.50,
      flightNumber: "123",
      duration: "15:45:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "60 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "10:30",
      departureLocation: "Chicago",
      arrivalTime: "14:00",
      arrivalLocation: "Paris",
      arrivalDate: "2024-01-06",
      departureDate: "2024-01-06",
      airline: "Air France",
      departureAirport: "ORD",
      arrivalAirport: "CDG",
      departureCity: "Chicago",
      arrivalCity: "Paris",
      totalMinimumFare: 865.60,
      flightNumber: "345",
      duration: "08:30:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "62 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "03:45",
      departureLocation: "San Francisco",
      arrivalTime: "05:30",
      arrivalLocation: "Beijing",
      arrivalDate: "2024-01-07",
      departureDate: "2024-01-07",
      airline: "Air China",
      departureAirport: "SFO",
      arrivalAirport: "PEK",
      departureCity: "San Francisco",
      arrivalCity: "Beijing",
      totalMinimumFare: 925.40,
      flightNumber: "678",
      duration: "10:45:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "57 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "07:15",
      departureLocation: "Atlanta",
      arrivalTime: "09:30",
      arrivalLocation: "Rome",
      arrivalDate: "2024-01-08",
      departureDate: "2024-01-08",
      airline: "Alitalia",
      departureAirport: "ATL",
      arrivalAirport: "FCO",
      departureCity: "Atlanta",
      arrivalCity: "Rome",
      totalMinimumFare: 780.75,
      flightNumber: "456",
      duration: "08:15:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "64 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "13:00",
      departureLocation: "Houston",
      arrivalTime: "15:15",
      arrivalLocation: "Hong Kong",
      arrivalDate: "2024-01-09",
      departureDate: "2024-01-09",
      airline: "Cathay Pacific",
      departureAirport: "IAH",
      arrivalAirport: "HKG",
      departureCity: "Houston",
      arrivalCity: "Hong Kong",
      totalMinimumFare: 975.90,
      flightNumber: "789",
      duration: "15:15:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "63 lbs",
            },
          ],
        },
      ],
    },
    {
      departureTime: "18:30",
      departureLocation: "Miami",
      arrivalTime: "20:45",
      arrivalLocation: "Dublin",
      arrivalDate: "2024-01-10",
      departureDate: "2024-01-10",
      airline: "Aer Lingus",
      departureAirport: "MIA",
      arrivalAirport: "DUB",
      departureCity: "Miami",
      arrivalCity: "Dublin",
      totalMinimumFare: 620.25,
      flightNumber: "890",
      duration: "07:15:00",
      baggageAllowance: [
        {
          type: "CHECKED",
          restrictions: [
            {
              type: "WEIGHT",
              value: "55 lbs",
            },
          ],
        },
      ],
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
    const username = req.session.user.username;

    // Insert data into flights table
    const flightInsertQuery = `
      INSERT INTO flights (departureTime, departureLocation, arrivalTime, arrivalLocation, airline, 
      departureAirport, arrivalAirport, departureCity, arrivalCity, totalMinimumFare, flightNumber, duration, baggageAllowance) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id;`;
    const flightValues = [flightData.departureTime, flightData.departureLocation, flightData.arrivalTime, flightData.arrivalLocation,
      flightData.airline, flightData.departureAirport, flightData.arrivalAirport, flightData.departureCity, flightData.arrivalCity,
      flightData.totalMinimumFare, flightData.flightNumber, flightData.duration, flightData.baggageAllowance];
    
    const flightInsertResult = await db.one(flightInsertQuery, flightValues);
    const flightId = flightInsertResult.id;

    // Retrieve user_id using username
    // const userIdResult = await db.one('SELECT user_id FROM users WHERE username = $1', [username]);
    // const userId = userIdResult.user_id;

    // // Assuming planner_id is available or created
    // const plannerId = await getOrCreatePlannerId(userId);

    // // Insert data into planner_item table
    // const plannerInsertQuery = 'INSERT INTO planner_item (planner_id, product_id, quantity) VALUES ($1, $2, $3);';
    // await db.none(plannerInsertQuery, [plannerId, flightId, 1]); // Assuming quantity is 1

    res.send('Flight data submitted successfully');
  } catch (err) {
    console.error('Error in submitting flight data', err);
    res.status(500).send('Error in submitting flight data');
  }
});

app.post('/submitHotelData', async (req, res) => {
  try {
    const hotelData = JSON.parse(req.body.hotelData);
    const username = req.session.user.username; // Assuming username is stored in session

    // Insert data into hotel table
    const hotelInsertQuery = `
      INSERT INTO hotel (areaName, starRating, addressLineOne, cityName, stateCode, countryCode, zip) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;
    const hotelValues = [hotelData.areaName, hotelData.starRating, hotelData.address.addressLineOne, hotelData.address.cityName, 
      hotelData.address.stateCode, hotelData.address.countryCode, hotelData.address.zip];
    
    const hotelInsertResult = await db.one(hotelInsertQuery, hotelValues);
    const hotelId = hotelInsertResult.id;

    // Retrieve user_id using username
    // const userIdResult = await db.one('SELECT user_id FROM users WHERE username = $1', [username]);
    // const userId = userIdResult.user_id;

    //not sure how to get planner id
    // Insert data into planner_item table
    // const plannerInsertQuery = 'INSERT INTO planner_item (planner_id, product_id, quantity) VALUES ($1, $2, $3);';
    // await db.none(plannerInsertQuery, [plannerId, hotelId, 1]); //


      res.send('Hotel data submitted successfully');
  } catch (err) {
      console.error('Error in submitting hotel data', err);
      res.status(500).send('Error in submitting hotel data');
  }
});

app.post('/cartItem/add', async (req, res) => {
  const item_id = parseInt(req.body.item_id);
  const ifCarorFlightorHotel = req.body.ifCarorFlightorHotel
  if(ifCarorFlightorHotel === "hotel"){
    db.one("INSERT INTO cartItem() VALUES (1$)", [item_id]);
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
    const user_planner = await db.oneOrNone(`SELECT * FROM planner WHERE username = '${req.session.user.username}'`);
    if(user_planner == NULL) {
      const errorMessage = "You haven't added any items. Add an item to view it here.";
      res.redirect(`pages/planner?error=${encodeURIComponent(errorMessage)}`);
    }

    const query = `SELECT * FROM planner_item WHERE planner_item.planner_id = '$1';`;
    let data = await db.any(query, user_planner);
    res.render("pages/planner", data);

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