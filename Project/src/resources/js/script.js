
const airportCodes = [
  { code: "AMS", name: "Amsterdam Airport Schiphol" },
  { code: "ANC", name: "Ted Stevens Anchorage International Airport" },
  { code: "ARN", name: "Stockholm Arlanda Airport" },
  { code: "ATH", name: "Athens International Airport" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport" },
  { code: "ATW", name: "Appleton International Airport" },
  { code: "AUS", name: "Austin-Bergstrom International Airport" },
  { code: "BKK", name: "Suvarnabhumi Airport" },
  { code: "BHM", name: "Birmingham-Shuttlesworth International Airport" },
  { code: "BNA", name: "Nashville International Airport" },
  { code: "BNE", name: "Brisbane Airport" },
  { code: "BOG", name: "El Dorado International Airport" },
  { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "BOS", name: "Logan International Airport" },
  { code: "BRU", name: "Brussels Airport" },
  { code: "BUD", name: "Budapest Ferenc Liszt International Airport" },
  { code: "BUF", name: "Buffalo Niagara International Airport" },
  { code: "CAN", name: "Guangzhou Baiyun International Airport" },
  { code: "CDG", name: "Charles de Gaulle Airport" },
  { code: "CGK", name: "Soekarno-Hatta International Airport" },
  { code: "CLT", name: "Charlotte Douglas International Airport" },
  { code: "CLE", name: "Cleveland Hopkins International Airport" },
  { code: "CMH", name: "John Glenn Columbus International Airport" },
  { code: "COS", name: "Colorado Springs Airport" },
  { code: "CPH", name: "Copenhagen Airport" },
  { code: "CPT", name: "Cape Town International Airport" },
  { code: "CTU", name: "Chengdu Shuangliu International Airport" },
  { code: "DEL", name: "Indira Gandhi International Airport" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport" },
  { code: "DOH", name: "Hamad International Airport" },
  { code: "DSM", name: "Des Moines International Airport" },
  { code: "DTW", name: "Detroit Metropolitan Wayne County Airport" },
  { code: "DUB", name: "Dublin Airport" },
  { code: "DUS", name: "Düsseldorf Airport" },
  { code: "DXB", name: "Dubai International Airport" },
  { code: "EDI", name: "Edinburgh Airport" },
  { code: "ELP", name: "El Paso International Airport" },
  { code: "EUG", name: "Eugene Airport" },
  { code: "EWR", name: "Newark Liberty International Airport" },
  { code: "FCO", name: "Leonardo da Vinci-Fiumicino Airport" },
  { code: "FRA", name: "Frankfurt Airport" },
  { code: "GRR", name: "Gerald R. Ford International Airport" },
  { code: "GSO", name: "Piedmont Triad International Airport" },
  { code: "GSP", name: "Greenville-Spartanburg International Airport" },
  { code: "HEL", name: "Helsinki-Vantaa Airport" },
  { code: "HSV", name: "Huntsville International Airport" },
  { code: "IAD", name: "Washington Dulles International Airport" },
  { code: "IAH", name: "George Bush Intercontinental Airport" },
  { code: "ICT", name: "Wichita Dwight D. Eisenhower National Airport" },
  { code: "IND", name: "Indianapolis International Airport" },
  { code: "IST", name: "Istanbul Airport" },
  { code: "JAX", name: "Jacksonville International Airport" },
  { code: "JFK", name: "John F. Kennedy International Airport" },
  { code: "JNB", name: "O.R. Tambo International Airport" },
  { code: "KIX", name: "Kansai International Airport" },
  { code: "KUL", name: "Kuala Lumpur International Airport" },
  { code: "LAS", name: "McCarran International Airport" },
  { code: "LAX", name: "Los Angeles International Airport" },
  { code: "LGA", name: "LaGuardia Airport" },
  { code: "LHR", name: "London Heathrow Airport" },
  { code: "LIS", name: "Lisbon Airport" },
  { code: "MAD", name: "Adolfo Suárez Madrid–Barajas Airport" },
  { code: "MAN", name: "Manchester Airport" },
  { code: "MCI", name: "Kansas City International Airport" },
  { code: "MEM", name: "Memphis International Airport" },
  { code: "MEX", name: "Benito Juárez International Airport" },
  { code: "MHT", name: "Manchester-Boston Regional Airport" },
  { code: "MIA", name: "Miami International Airport" },
  { code: "MKE", name: "General Mitchell International Airport" },
  { code: "MSP", name: "Minneapolis-Saint Paul International Airport" },
  { code: "MSY", name: "Louis Armstrong New Orleans International Airport" },
  { code: "MYR", name: "Myrtle Beach International Airport" },
  { code: "NCE", name: "Nice Côte d'Azur Airport" },
  { code: "NRT", name: "Narita International Airport" },
  { code: "OKC", name: "Will Rogers World Airport" },
  { code: "OMA", name: "Eppley Airfield" },
  { code: "ONT", name: "Ontario International Airport" },
  { code: "ORD", name: "O'Hare International Airport" },
  { code: "PBI", name: "Palm Beach International Airport" },
  { code: "PDX", name: "Portland International Airport" },
  { code: "PEK", name: "Beijing Capital International Airport" },
  { code: "PHL", name: "Philadelphia International Airport" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport" },
  { code: "PIT", name: "Pittsburgh International Airport" },
  { code: "PRG", name: "Václav Havel Airport Prague" },
  { code: "RDU", name: "Raleigh-Durham International Airport" },
  { code: "RNO", name: "Reno-Tahoe International Airport" },
  { code: "ROC", name: "Greater Rochester International Airport" },
  { code: "RSW", name: "Southwest Florida International Airport" },
  { code: "SAN", name: "San Diego International Airport" },
  { code: "SAT", name: "San Antonio International Airport" },
  { code: "SAV", name: "Savannah/Hilton Head International Airport" },
  { code: "SEA", name: "Seattle-Tacoma International Airport" },
  { code: "SFO", name: "San Francisco International Airport" },
  { code: "SIN", name: "Singapore Changi Airport" },
  { code: "SJC", name: "Norman Y. Mineta San Jose International Airport" },
  { code: "SJU", name: "Luis Muñoz Marín International Airport" },
  { code: "SLC", name: "Salt Lake City International Airport" },
  { code: "SMF", name: "Sacramento International Airport" },
  { code: "SNA", name: "John Wayne Airport" },
  { code: "SRQ", name: "Sarasota-Bradenton International Airport" },
  { code: "STL", name: "St. Louis Lambert International Airport" },
  { code: "SYD", name: "Sydney Kingsford Smith Airport" },
  { code: "SYD", name: "Sydney Airport" },
  { code: "TLH", name: "Tallahassee International Airport" },
  { code: "TPA", name: "Tampa International Airport" },
  { code: "TUL", name: "Tulsa International Airport" },
  { code: "TUS", name: "Tucson International Airport" },
  { code: "VIE", name: "Vienna International Airport" },
  { code: "VPS", name: "Destin-Fort Walton Beach Airport" },
  { code: "XNA", name: "Northwest Arkansas National Airport" },
  { code: "YEG", name: "Edmonton International Airport" },
  { code: "YUL", name: "Montréal-Pierre Elliott Trudeau International Airport" },
  { code: "YVR", name: "Vancouver International Airport" },
  { code: "YYC", name: "Calgary International Airport" },
  { code: "YYT", name: "St. John's International Airport" },
  { code: "YYZ", name: "Toronto Pearson International Airport" },
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