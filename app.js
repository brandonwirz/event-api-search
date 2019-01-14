const map;

function initMap()  {
  let latlng = new google.maps.LatLng();
  let mapOptions = {
    zoom:0,
    center:latlng
  }
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function apiData() {
  
}
