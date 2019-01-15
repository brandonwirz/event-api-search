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
  $('.search-results').html(''); // Clear Search Results
  $('#map').html('');

  // Get Input from the form
    let l = $('#city').val();

    $.ajax({
        url: "https://api.eventful.com/json/events/search",
        type: "GET",
        data: {
            app_key: "",
            q: "music",
        },
        crossDomain: true,
        dataType: 'jsonp'
    }).then(function(data) {

        initialize(data);

        for (let i = 0; i < data.events.event.length; i++) {
            let output = getOutput(data.events.event[i]);// Get Output
            $('.search-results').append(output);// Display Results
        }
    });
}
