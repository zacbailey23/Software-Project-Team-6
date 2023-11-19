function initializeContent() {
    const flightInfoArray = [
      {
        departureTime: "10:30 AM",
        departureLocation: "John F. Kennedy International Airport",
        airline: "Delta Airlines",
        departureAirport: "JFK",
        departureCity: "New York",
        totalMinimumFare: "$350",
        city: "New York",
        numberOfConnections: 2,
        arrivalCity: "Los Angeles"
      },
      {
        arrivalTime: "4:45 PM",
        arrivalLocation: "Los Angeles International Airport",
        airline: "Delta Airlines",
        arrivalAirport: "LAX",
        arrivalCity: "Los Angeles",
        totalMinimumFare: "$450",
        city: "Los Angeles",
        numberOfConnections: 2
      },
      {
        departureTime: "8:00 AM",
        departureLocation: "Chicago O'Hare International Airport",
        airline: "American Airlines",
        departureAirport: "ORD",
        departureCity: "Chicago",
        totalMinimumFare: "$300",
        city: "Chicago",
        numberOfConnections: 1
      },
      {
        arrivalTime: "12:15 PM",
        arrivalLocation: "San Francisco International Airport",
        airline: "United Airlines",
        arrivalAirport: "SFO",
        arrivalCity: "San Francisco",
        totalMinimumFare: "$400",
        city: "San Francisco",
        numberOfConnections: 1
      }
    ];
    const hotelInfoArray = [
        {
          id: 1,
          name: "Luxury Hotel",
          area_name: "Downtown",
          starRating: 5,
          address: {
            cityName: "New York City",
            addressLineOne: "123 Luxury Street",
            stateCode: "NY",
            countryCode: "US",
            zip: "10001"
          }
        },
        {
          id: 2,
          name: "Cozy Inn",
          area_name: "Suburb",
          starRating: 3,
          address: {
            cityName: "Los Angeles",
            addressLineOne: "456 Cozy Avenue",
            stateCode: "CA",
            countryCode: "US",
            zip: "90001"
          }
        },
        {
            id: 3,
            name: "Mountain Retreat",
            area_name: "Mountain Town",
            starRating: 4,
            address: {
              cityName: "Denver",
              addressLineOne: "789 Mountain Road",
              stateCode: "CO",
              countryCode: "US",
              zip: "80202"
            }
          },
          {
            id: 4,
            name: "Beachfront Resort",
            area_name: "Beachfront",
            starRating: 4,
            address: {
              cityName: "Miami",
              addressLineOne: "987 Beach Boulevard",
              stateCode: "FL",
              countryCode: "US",
              zip: "33101"
            }
          },
          {
            id: 5,
            name: "Historic Inn",
            area_name: "Old Town",
            starRating: 3,
            address: {
              cityName: "Charleston",
              addressLineOne: "567 Historic Lane",
              stateCode: "SC",
              countryCode: "US",
              zip: "29401"
            }
          },
          {
            id: 6,
            name: "Ski Lodge",
            area_name: "Mountain Resort",
            starRating: 4,
            address: {
              cityName: "Aspen",
              addressLineOne: "321 Ski Slope Road",
              stateCode: "CO",
              countryCode: "US",
              zip: "81611"
            }
          },
          {
            id: 7,
            name: "Lakeview Retreat",
            area_name: "Lakefront",
            starRating: 5,
            address: {
              cityName: "Lake Tahoe",
              addressLineOne: "654 Lakeview Drive",
              stateCode: "CA",
              countryCode: "US",
              zip: "96150"
            }
          }
          // You can add more hotel information objects as needed
        ];
    const container = document.getElementById('cardsContainer'); // make sure you have this container in your HTML
  
    flightInfoArray.forEach(flightInfo => {
      const card = createFlightCard(flightInfo);
      container.appendChild(card);
    });
    hotelInfoArray.forEach(movieInfo => {
        const card = createHotelCard(movieInfo);
        container.appendChild(card);
      });
  }
  

function renderSearchResults(data) {
    const container = document.getElementById('searchResultsContainer');
    container.innerHTML = ''; // Clear previous results

    // Check if 'hotelsInfo' array exists in the data
    if (data.hotelsInfo) {
        data.hotelsInfo.forEach(hotel => {
            const hotelCard = createHotelCard(hotel);
            container.appendChild(hotelCard);
        });
    }

    // Check if 'flightsInfo' array exists in the data
    if (data.flightsInfo) {
        data.flightsInfo.forEach(flight => {
            const flightCard = createFlightCard(flight);
            container.appendChild(flightCard);
        });
    }
}

function createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${hotel.name}</h2>
        <p>Star Rating: ${hotel.starRating}</p>
        <p>Address: ${hotel.address.addressLineOne}, ${hotel.address.cityName}</p>
        <!-- Add more hotel details as needed -->
        <button onclick="submitHotelData('${hotel.id}')">Submit</button>
    `;
    return card;
}

function createFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${flight.airline}</h2>
        <p>Departure: ${flight.departureTime} from ${flight.departureLocation}</p>
        <p>Arrival: ${flight.arrivalTime} at ${flight.arrivalLocation}</p>
        <!-- Add more flight details as needed -->
        <button onclick="submitFlightData('${flight.id}')">Submit</button>
    `;
    return card;
}

// Function to handle changes in the search type dropdown
function handleSearchTypeChange(value) {
    const flightFields = document.getElementById('flightFields');
    const hotelFields = document.getElementById('hotelFields');
    const returnDateField = document.getElementById('returnDateField');
    const queryType = document.getElementById('queryType').value;
    submitBtn.style.display = 'block'; // Show the button

    if (queryType === 'flightSearchTwoWay') {
        flightFields.style.display = 'block';
        hotelFields.style.display = 'none';
    } else if (queryType === 'flightSearchOneWay') {
        flightFields.style.display = 'block';
        hotelFields.style.display = 'none';
    } else if (queryType === 'hotelSearch') {
        flightFields.style.display = 'none';
        hotelFields.style.display = 'block';
    }
}