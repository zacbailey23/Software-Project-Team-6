import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';

const apiOptions = {
  apiKey: "YOUR API KEY"
}

const loader = new Loader(apiOptions);

loader.load().then(() => {
  console.log('Maps JS API loaded');
  const map = displayMap();
  const markers = addMarkers(map);
  clusterMarkers(map, markers);
  addPanToMarker(map, markers);
});

function displayMap() {
  const mapOptions = {
    center: { lat: -33.860664, lng: 151.208138 },
    zoom: 14,
    mapId: 'YOUR_MAP_ID'
  };
  const mapDiv = document.getElementById('map');
  return new google.maps.Map(mapDiv, mapOptions);
}

//next need to figure out how to make the map to our best use for the app
//function features: user can pinpoint hotels and alike based on their search
