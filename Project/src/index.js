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
  const maxFlights = 75; // Move this constant outside of the sub-functions as it's used in multiple places

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
          image: 'https:' + hotel.thumbnail,
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
        number_of_itineraries: '75',
        currency: 'USD'

      },
      headers: {
        'X-RapidAPI-Key': process.env.Priceline_API_Key,
        'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
      }
    };
  } else if (query.queryType === 'hotelSearch') {
    options = {
      method: 'GET',
      url: 'https://priceline-com-provider.p.rapidapi.com/v2/hotels/autoSuggest',
      params: {
        string: query.hotelLocation, // must be a city
        get_hotels: 'true',
        max_results: '30'
      },
      headers: {
        'X-RapidAPI-Key': process.env.Priceline_API_Key,
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
  if (req.session && req.session.user) {
    res.render('pages/searchResults', { data: templateData, user: req.session.user });
  } else {
    // Handle the case where the session or user is not set
    res.render('pages/searchResults', { data: templateData, user: null });
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
app.get('/homepage', async (req, res) => {
  try {
    // Fetch flight information from the database
    const flights = await db.any('SELECT * FROM flights');

    // Fetch hotel information from the database
    const hotels = await db.any('SELECT * FROM hotels');
    if (req.session && req.session.user) {
      res.render('pages/homepage', {
        user: req.session.user,
        flights: flights || [],
        hotels: hotels || [],
      });
    } else {
      // Handle the case where the session or user is not set
      res.render('pages/homepage', {
        user: null,
        flights: flights,
        hotels: hotels,
      });
    }
  } catch (err) {
    res.render('pages/homepage', {
      user: null,
      flights: [],
      hotels: [],
      error: err.message,
    });
  }

});


app.get('/register', (req, res) => {
  res.render('pages/register');
});
app.post('/register', async (req, res) => {
  try {
    // Check if username already exists
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1;', req.body.username);

    if (existingUser) {
      // Username already exists
      res.render('pages/register', { message: 'Username already exists. Please choose a different one.' });
      return;
    }
    // Hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password, dob, email, phone, first_name, last_name, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
    await db.none(query, [req.body.username, hash, req.body.date_of_birth, req.body.email, req.body.phone, req.body.first_name, req.body.last_name, req.body.location]);
    res.redirect('/login');

  } catch (error) {
    //console.error('Error during registration:', error);
    res.render('pages/register', { message: 'Error during registration. Please try again.' });
  }
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', async (req, res) => {
  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1;', [req.body.username]);

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
app.use(auth);

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/homepage');
});

app.post('/plannerItem/add', async (req, res) => {
  // const planner_id = parseInt(req.body.planner_id);
  var user_planner = await db.oneOrNone(`SELECT id FROM planner WHERE username = '${req.session.user.username}';`);
  // console.log(user_planner);
  if (user_planner == null) {
    user_planner = (await db.one(`SELECT COUNT(id) FROM planner;`));
    // Use db.one if you want to return the id of the newly inserted planner
    let newPlanner = await db.one(`INSERT INTO planner (id, username) VALUES (${user_planner.count}, '${req.session.user.username}') RETURNING id;`);
    user_planner = { id: newPlanner.id };
  }

  try {
    // Inserting values into the planner_item table
    if (req.body.flightData === undefined) {

      const event_title = req.body.event_title;
      const date = req.body.date || null; 
      const departuretime = req.body.departuretime || null;
      const arrivaltime = req.body.arrivaltime || null; 
      const departurelocation = req.body.departurelocation || null;
      const arrivallocation = req.body.arrivallocation || null;
      const description = req.body.description || null;

      // Inserting values into the planner_item table
      const query = `INSERT INTO planner_item (event_title, time, date, location, description, planner_id) 
                     VALUES ($1, $2, $3, $4, $5, $6);`;

      await db.none(query, [event_title, arrivaltime, date, arrivallocation, description, user_planner.id]);
    }
    else {
      let flightData = toLowerCaseKeys(JSON.parse(req.body.flightData))
      const event_title = `${flightData.airline} - Flight ${flightData.flightnumber ?? flightData.flightNumber}`
      const date = flightData.departuredate ?? flightData.departureDate;
      const departuretime = flightData.departuretime ?? flightData.departureTime;
      const arrivaltime = flightData.arrivaltime ?? flightData.arrivalTime;
      const departurelocation = flightData.departurecity ?? flightData.departureCity;
      const arrivallocation = flightData.arrivalcity ?? flightData.arrivalCity;
      const description = `Departure: ${departurelocation} at ${departuretime}`

      //console.log(event_title, "<- should be event title")

      const query = `INSERT INTO planner_item (event_title, time, date, location, description, planner_id) 
                    VALUES ($1, $2, $3, $4, $5, $6);`;

      await db.none(query, [event_title, arrivaltime, date, arrivallocation, description, user_planner.id]);
    }
    res.redirect('/planner');
  } catch (err) {

    console.log(err);
    res.redirect('/planner');
  }
});

function toLowerCaseKeys(obj) {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
}

app.post('/plannerItemHotel/add', async (req, res) => {
  // const planner_id = parseInt(req.body.planner_id);
  var user_planner = await db.oneOrNone(`SELECT id FROM planner WHERE username = '${req.session.user.username}';`);
  // console.log(user_planner);
  if (user_planner == null) {
    // assign a number
    user_planner = (await db.one(`SELECT COUNT(id) FROM planner;`));
    // console.log(user_planner.count);
    let any = await db.one(`INSERT INTO planner (id, username) VALUES (${user_planner.count}, '${req.session.user.username}');`);
  }

  try {
    // Inserting values into the planner_item table
    let hotelData = toLowerCaseKeys(JSON.parse(req.body.hotelData))

    const event_title = `${hotelData.name}`
    const date = new Date().toDateString(); // TODO: Change to a proper
    const time = "03:00";
    const location = hotelData.cityname ?? hotelData.address?.cityName;
    const description = `Hotel booking in ${hotelData.areaname ?? hotelData.address?.stateCode}`

    //console.log(event_title, "<- should be event title")

    const query = `INSERT INTO planner_item (event_title, time, date, location, description, planner_id) 
                    VALUES ($1, $2, $3, $4, $5, $6);`;

    await db.none(query, [event_title, time, date, location, description, user_planner.id]);

    res.redirect('/planner');
  } catch (err) {

    console.log(err);
    res.redirect('/planner');
  }
});

app.post('/plannerItem/delete', async (req, res) => {
  // console.log(req.body);
  // const planner_id = parseInt(req.body.item_id);
  try {
    const query = `DELETE FROM planner_item WHERE event_title = '${req.body.event_title}';`;
    let any = await db.any(query);

    res.redirect('/planner', {
      message: 'Successfully deleted.',
      action: 'delete',
    });

  } catch (err) {
    console.log(err);
    return res.redirect('/planner');
  }
});

// app.post('/plannerItem/update' , async (req,res) => {
//   const user_planner = await db.oneOrNone(`SELECT id FROM planner WHERE username = '${req.session.user.username}';`);
//   const item_id = parseInt(req.body.item_id)

// });

app.get('/planner', async (req, res) => {
  try {
    const user_planner = await db.oneOrNone(`SELECT id FROM planner WHERE username = '${req.session.user.username}';`);

    if (user_planner == null) {
      return res.render('pages/planner', { user: req.session.user, data: null });
    }

    const query = `SELECT * FROM planner_item WHERE planner_item.planner_id = ${user_planner.id} ORDER BY date DESC;`;
    let items = await db.any(query);
    //console.log(items);
    res.render("pages/planner", { user: req.session.user, data: items });

  } catch (error) {
    console.log(error);
    const errorMessage = "Error loading planner.";
    return res.redirect(`/homepage?error=${encodeURIComponent(errorMessage)}`);
  }
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');