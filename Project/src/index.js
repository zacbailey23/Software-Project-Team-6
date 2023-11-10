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

// TODO - Include your API routes here
app.get('/', (req, res) => {
  res.redirect('pages/login');
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
  res.render('Project/pages/login');
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

    res.redirect('/discover');
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
// app.get('/discover', async (req, res) => {
//   try {
//     const response = await axios({
//       url: `https://app.ticketmaster.com/discovery/v2/events.json`,
//       method: 'GET',
//       dataType: 'json',
//       headers: {
//         'Accept-Encoding': 'application/json',
//       },


//       params: {
//         apikey: process.env.API_KEY,
//         keyword: 'Phoenix Suns',
//         size: 10
//       },
//     });

//     const events = response.data._embedded.events;
//     res.render('pages/discover', { events: events });

//   } catch (error) {
//     console.error("Error fetching from Ticketmaster API:", error.message);
//     res.render('pages/discover', { events: [], error: error.message });
//   }
// });


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
app.listen(3000);
console.log('Server is listening on port 3000');