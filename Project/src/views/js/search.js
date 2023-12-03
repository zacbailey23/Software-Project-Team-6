function initMap(){
    let map = new google.maps.Map(document.getElementById("map"), {
    zoom: countries["us"].zoom,
    center: countries["us"].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false,
  });
  
  let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      {
        types: ["(cities)"],
        componentRestrictions: countryRestrict,
        fields: ["geometry"],
      },
  );
  
  places = new google.maps.places.PlacesService(map);
  autocomplete.addListener("place_changed", onPlaceChanged);
  
  // When the user selects a city, get the place details for the city and
  // zoom the map in on the city.
  function onPlaceChanged() {
    const place = autocomplete.getPlace();
  
    if (place.geometry && place.geometry.location) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      search();
    } else {
      document.getElementById("autocomplete").placeholder = "Enter a city";
    }
  }
  }
  
  window.initMap = initMap
  
  
    // Add a DOM event listener to react when the user selects a country.
    // document
    //   .getElementById("country")
    //   .addEventListener("change", setAutocompleteCountry);
  
  //onPlaceChanged
  
  //onAutoCountry 
  