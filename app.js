let map;
const API_URL = "https://api.eventful.com/json/events/search";
const API_KEY = "";

function initMap() {
    const latlng = new google.maps.LatLng(40.014984, -105.270546);
    const mapOptions = {
        zoom: 0,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

// Get Data From Eventful API
function getApiData() {
    // $(".loader").show();
    // Clear Results
    $('.search-results').html('');
    $('#map').html('');

    // Get Form Input
    const l = $('#city').val();
    // Run GET Request on API
    $.ajax({
        url: API_URL,
        type: "GET",
        data: {
            app_key: API_KEY,
            q: "music",
            l: l,
            t: "Today",
            sort_order: "popularity",
            c: "music, concerts, blues, jazz, nightlife"
        },
        crossDomain: true,
        dataType: 'jsonp'
    }).then(function(data) {
        // $(".loader").hide("fast");

        initializeMap(data);

            for (let i = 0; i < data.events.event.length; i++) {
            // Get Output
            const output = showResults(data.events.event[i]);
            // Display Results
            $('.search-results').append(output);

            // if($('.search-results').empty)
            // }
            // if($('.search-results').val().length === 0 ) {
            //   alert("please enter a location")
            }
        });
    //})
}


//Build Output
function showResults(item) {
    let eventID = item.id;
    let title = item.title;
    let eventURL = item.url;
    let urlImage = item.image ? item.image.medium.url : '';

    // let urlImage = item.image.medium.url;
    let description = item.description;
    let eventStart = item.start_time;
    let venueName = item.venue_name;
    let venueAddress = item.venue_address + ", " + item.city_name + " " + item.region_abbr;
    let venueURL = item.venue_url;
    let eventLat = item.latitude;
    let eventLng = item.longitude;

    // Build Output String
   const output = `
      <li>
        <div class="thumbnail-40">
          <img src="${urlImage}" alt="Event Image">
        </div>
        <div class="displayed-result">
          <p>
            <strong>Event: </strong>
            <a href="${eventURL}" target="_blank">${title}</a>
            <br>
            <strong>Venue: </strong>
            ${venueName}
            <br>
            <strong>Address</strong>
            <a href="http://maps.google.com/?q=${venueAddress}" target="_blank">${venueAddress}</a>
            <br>
            <strong>Start: </strong>
            ${eventStart}
          </p>
        </div>
      </li>
    <div class="clearfix"></div>`;
    return output;
}

// Build Map
function displayMapMarkers(data) {
    let markersData = data.events.event;
    let bounds = new google.maps.LatLngBounds();

}



// Show/Hide Search Form
function eventSearchToggle() {
    $('.search-button').on('click', function() {
      $('.display-results-container').show(0);
        $('.search-results').show(0);
        $('.search-section').hide();
        $('.banner').show(0);
        $('.new-search-button').show(0);
        $('.logo').show(0);
        $('.main').hide(0);
    });
    $('.js-new-search-button').on('click', function() {
        $('.display-results-container').hide(0);
        $('.new-search-button').hide(0);
        $('.search-section').show(0);
        $('.main').show(0);
    });
}

function showMap() {
    $('.search-button').on('click', function() {
        $('#map').show();
    });
}

$('document').ready(function() {
    // $(window).load(function() {
    //     $(".loader").fadeOut("slow");
    // })
    $('.search-button').on('click', function(e) {
        e.preventDefault();
        getApiData();
    })
    showMap();
    eventSearchToggle();
})
