
const airportCodes = [
  { code: "AUS", name: "Austin-Bergstrom International Airport" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport" },
  { code: "BHM", name: "Birmingham-Shuttlesworth International Airport" },
  { code: "BNA", name: "Nashville International Airport" },
  { code: "BOS", name: "Logan International Airport" },
  { code: "BUF", name: "Buffalo Niagara International Airport" },
  { code: "BWI", name: "Baltimore/Washington International Thurgood Marshall Airport" },
  { code: "CAN", name: "Guangzhou Baiyun International Airport" },
  { code: "CDG", name: "Charles de Gaulle Airport" },
  { code: "CLE", name: "Cleveland Hopkins International Airport" },
  { code: "CMH", name: "John Glenn Columbus International Airport" },
  { code: "CVG", name: "Cincinnati/Northern Kentucky International Airport" },
  { code: "DCA", name: "Ronald Reagan Washington National Airport" },
  { code: "DEN", name: "Denver International Airport" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport" },
  { code: "DTW", name: "Detroit Metropolitan Wayne County Airport" },
  { code: "DXB", name: "Dubai International Airport" },
  { code: "EWR", name: "Newark Liberty International Airport" },
  { code: "FRA", name: "Frankfurt Airport" },
  { code: "HKG", name: "Hong Kong International Airport" },
  { code: "HND", name: "Tokyo Haneda Airport" },
  { code: "IAH", name: "George Bush Intercontinental Airport" },
  { code: "ICN", name: "Incheon International Airport" },
  { code: "IND", name: "Indianapolis International Airport" },
  { code: "JFK", name: "John F. Kennedy International Airport" },
  { code: "JNB", name: "O.R. Tambo International Airport" },
  { code: "LAS", name: "McCarran International Airport" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "LGA", name: "LaGuardia Airport" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "MCI", name: "Kansas City International Airport" },
  { code: "MEM", name: "Memphis International Airport" },
  { code: "MEX", name: "Benito Juárez International Airport" },
  { code: "MIA", name: "Miami International Airport" },
  { code: "MKE", name: "General Mitchell International Airport" },
  { code: "MSP", name: "Minneapolis-Saint Paul International Airport" },
  { code: "MSY", name: "Louis Armstrong New Orleans International Airport" },
  { code: "OAK", name: "Oakland International Airport" },
  { code: "OKC", name: "Will Rogers World Airport" },
  { code: "ORD", name: "O'Hare International Airport" },
  { code: "PDX", name: "Portland International Airport" },
  { code: "PEK", name: "Beijing Capital International Airport" },
  { code: "PHL", name: "Philadelphia International Airport" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport" },
  { code: "PIT", name: "Pittsburgh International Airport" },
  { code: "RDU", name: "Raleigh-Durham International Airport" },
  { code: "RSW", name: "Southwest Florida International Airport" },
  { code: "SAN", name: "San Diego International Airport" },
  { code: "SAT", name: "San Antonio International Airport" },
  { code: "SEA", name: "Seattle-Tacoma International Airport" },
  { code: "SFO", name: "San Francisco International Airport" },
  { code: "SJC", name: "San Jose International Airport" },
  { code: "SJU", name: "Luis Muñoz Marín International Airport" },
  { code: "SLC", name: "Salt Lake City International Airport" },
  { code: "SMF", name: "Sacramento International Airport" },
  { code: "SNA", name: "John Wayne Airport" },
  { code: "STL", name: "St. Louis Lambert International Airport" },
  { code: "SYD", name: "Sydney Airport" },
  { code: "SYD", name: "Sydney Kingsford Smith Airport" },
  { code: "TPA", name: "Tampa International Airport" },
  { code: "YYZ", name: "Toronto Pearson International Airport" },
  // New airports added alphabetically below
  { code: "AMS", name: "Amsterdam Airport Schiphol" },
  { code: "ANC", name: "Ted Stevens Anchorage International Airport" },
  { code: "ATH", name: "Athens International Airport" },
  { code: "ATW", name: "Appleton International Airport" },
  { code: "AUS", name: "Austin-Bergstrom International Airport" },
  { code: "BKK", name: "Suvarnabhumi Airport" },
  { code: "BNE", name: "Brisbane Airport" },
  { code: "BOG", name: "El Dorado International Airport" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "BRU", name: "Brussels Airport" },
  { code: "BUD", name: "Budapest Ferenc Liszt International Airport" },
  { code: "CAN", name: "Guangzhou Baiyun International Airport" },
  { code: "CGK", name: "Soekarno-Hatta International Airport" },
  { code: "CLT", name: "Charlotte Douglas International Airport" },
  { code: "CMH", name: "John Glenn Columbus International Airport" },
  { code: "CPH", name: "Copenhagen Airport" },
  { code: "CPT", name: "Cape Town International Airport" },
  { code: "CTU", name: "Chengdu Shuangliu International Airport" },
  { code: "DEL", name: "Indira Gandhi International Airport" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport" },
  { code: "DOH", name: "Hamad International Airport" },
  { code: "DTW", name: "Detroit Metropolitan Wayne County Airport" },
  { code: "DUB", name: "Dublin Airport" },
  { code: "DUS", name: "Düsseldorf Airport" },
  { code: "DXB", name: "Dubai International Airport" },
  { code: "EDI", name: "Edinburgh Airport" },
  { code: "EWR", name: "Newark Liberty International Airport" },
  { code: "FCO", name: "Leonardo da Vinci-Fiumicino Airport" },
  { code: "FRA", name: "Frankfurt Airport" },
  { code: "GRU", name: "São Paulo–Guarulhos International Airport" },
  { code: "HKG", name: "Hong Kong International Airport" },
  { code: "HND", name: "Tokyo Haneda Airport" },
  { code: "IAH", name: "George Bush Intercontinental Airport" },
  { code: "ICN", name: "Incheon International Airport" },
  { code: "IST", name: "Istanbul Airport" },
  { code: "JFK", name: "John F. Kennedy International Airport" },
  { code: "JNB", name: "O.R. Tambo International Airport" },
  { code: "KIX", name: "Kansai International Airport" },
  { code: "KUL", name: "Kuala Lumpur International Airport" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport" },
  { code: "MAN", name: "Manchester Airport" },
  { code: "MCO", name: "Orlando International Airport" },
  { code: "MIA", name: "Miami International Airport" },
  { code: "MUC", name: "Munich Airport" },
  { code: "NRT", name: "Narita International Airport" },
  { code: "ORD", name: "O'Hare International Airport" },
  { code: "PEK", name: "Beijing Capital International Airport" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport" },
  { code: "SEA", name: "Seattle-Tacoma International Airport" },
  { code: "SFO", name: "San Francisco International Airport" },
  { code: "SIN", name: "Singapore Changi Airport" },
  { code: "SYD", name: "Sydney Kingsford Smith Airport" },
  { code: "YYZ", name: "Toronto Pearson International Airport" },
  { code: "ZRH", name: "Zurich Airport" },
  { code: "ARN", name: "Stockholm Arlanda Airport" },
  { code: "LIS", name: "Lisbon Airport" },
  { code: "SVO", name: "Sheremetyevo International Airport" },
  { code: "VIE", name: "Vienna International Airport" },
  { code: "NCE", name: "Nice Côte d'Azur Airport" },
  { code: "HEL", name: "Helsinki-Vantaa Airport" },
  { code: "PRG", name: "Václav Havel Airport Prague" },
  { code: "CPH", name: "Copenhagen Airport" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport" },
  { code: "MUC", name: "Munich Airport" },
  { code: "ATH", name: "Athens International Airport" },
  { code: "IST", name: "Istanbul Airport" },
  { code: "ZRH", name: "Zurich Airport" },
  { code: "DUB", name: "Dublin Airport" },
  { code: "MEX", name: "Benito Juárez International Airport" },
  { code: "DUS", name: "Düsseldorf Airport" },
  { code: "CGK", name: "Soekarno-Hatta International Airport" },
  { code: "MSP", name: "Minneapolis-Saint Paul International Airport" },
  { code: "CLT", name: "Charlotte Douglas International Airport" },
  { code: "KUL", name: "Kuala Lumpur International Airport" },
  { code: "LIS", name: "Lisbon Airport" },
  { code: "PRG", name: "Václav Havel Airport Prague" },
  { code: "VIE", name: "Vienna International Airport" },
  { code: "SVO", name: "Sheremetyevo International Airport" },
  { code: "ARN", name: "Stockholm Arlanda Airport" },
  { code: "NCE", name: "Nice Côte d'Azur Airport" },
  { code: "HEL", name: "Helsinki-Vantaa Airport" },
  // Continue adding real airports here...
];

function populateAirportDropdowns() {
  const originSelect = document.getElementById('origin');
  const destinationSelect = document.getElementById('destination');

  if (!originSelect || !destinationSelect) {
      console.error("Dropdown elements not found.");
      return;
  }

  airportCodes.forEach(airport => {
      const option = document.createElement('option');
      option.value = airport.code;
      option.textContent = `${airport.code} - ${airport.name}`;
      
      const destOption = option.cloneNode(true);

      originSelect.appendChild(option);
      destinationSelect.appendChild(destOption);
  });

  console.log("Dropdowns populated successfully.");
}

if (document.readyState === "loading") {  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", populateAirportDropdowns);
} else {  // `DOMContentLoaded` has already fired
  populateAirportDropdowns();
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
function validateDateInput() {
  var selectedQueryType = document.getElementById('queryType').value;

  // Check if the selected query type is for flights
  if (selectedQueryType.startsWith("flightSearch")) {
    var departureDate = document.getElementById('departureDate').value;
    var returnDate = document.getElementById('returnDate').value;
    var dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!departureDate.match(dateRegex) || !returnDate.match(dateRegex)) {
      alert('Please enter dates in YYYY-MM-DD format.');
      return false;
    }
  }
  return true;
}