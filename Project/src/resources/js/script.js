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
    const searchType = document.getElementById('searchType').value;

    if (searchType === 'flightSearchTwoWay') {
        flightFields.style.display = 'block';
        hotelFields.style.display = 'none';
        returnDateField.style.display = 'block';
    } else if (searchType === 'flightSearchOneWay') {
        flightFields.style.display = 'block';
        hotelFields.style.display = 'none';
        returnDateField.style.display = 'none';
    } else if (searchType === 'hotelSearch') {
        flightFields.style.display = 'none';
        hotelFields.style.display = 'block';
    }
}
// Function to handle the form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const searchType = document.getElementById('searchType').value;
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queryType: searchType, ...formProps })
    })
    .then(response => response.json())
    .then(data => {
        // Handle response data, such as updating the page with search results
        renderSearchResults(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Attach event listeners using the named functions
document.getElementById('searchType').addEventListener('change', handleSearchTypeChange);
document.getElementById('searchForm').addEventListener('submit', handleFormSubmit);
