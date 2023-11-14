// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case

  ///////////////////////////////
  ///    LOGIN TEST CASES
  ///////////////////////////////

  //Positive case

  //We are checking POST /login API by passing the correct user info in the correct order. This test case should pass and return a status 200.
  it('positive : /login', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'audra', password: 'test'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //Negative Cases

  //We are checking POST /login API by passing the user info in in incorrect manner (incorrect username). This test case should pass and return a status 200.
  it('negative : /login. Checking invalid name', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'audra111', password: 'test'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body.error).to.equals('Incorrect username or password.');
        done();
      });
  });

  //We are checking POST /login API by passing the user info in in incorrect manner (incorrect password). This test case should pass and return a status 200.
  it('negative : /login. Checking invalid pass', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'audra', password: 'test111'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body.error).to.equals('Incorrect username or password.');
        done();
      });
  });
  //-----------------------------------------------------
  //part B
  it('positive : /cartItem/add', done => {
    chai
      .request(server)
      .post('/cartItem/add')
      .send({item_id: '2', username: noah , location: 12, ticket_price: '2400.89', car_id: 3, date: 42, time: '8th', total: 'One'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });

  it('negative : /cartItem/add. checking delete function', done => {
    chai
      .request(server)
      .post('/cartItem/delete')
      .send({item_id: 2, username: 'noah', location: 'Tokyo', ticket_price: 2400.89, car_id: 2, date: 2023-11-13, time: 12:0o0:0o0, total: 3000.00})
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body.error).to.equals('Incorrect username or password.');
        done();
      });
  });


});