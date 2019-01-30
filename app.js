let map;
const API_URL = "https://api.eventful.com/json/events/search";
const API_KEY = "C9bx5dgQqBb7RZsr";

function initMap() {
    const latlng = new google.maps.LatLng(40.014984, -105.270546);
    const mapOptions = {
        zoom: 0,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//show search results
function eventSearch() {
    $('.search-results').html(''); // Clear Results
    $('#map').html('');
    $('.display-results-container').show();
    $('.search-results').show();
    $('.search-section').hide("fast", "swing");
    $('.top-banner').show();
    $('.new-search-button').show();
    $('.logo').show();
  // });
}
// Get Data From Eventful API
function getApiData() {
  // Get Form Input
  const location = $('#city-search').val();
    if (location.length === 0 ) {
         alert("Please enter a location to search for events");
         return false
    } else {
      $(".pre-loader").show();
      //search results
      eventSearch()
      // GET Request for API
      $.ajax({
          url: API_URL,
          type: "GET",
          data: {
              app_key: API_KEY,
              q: "music",
              l: location,
              t: "Today",
              page_size: 30,
              sort_order: "popularity",
              c: "music, concerts, nightlife, blues, jazz" //categories
          },
          crossDomain: true,
          dataType: 'jsonp'
       }).then(function(data) {
            $(".pre-loader").hide("fast");
            $('.main').hide("fast");
            initializeMap(data);
                for (let i = 0; i < data.events.event.length; i++) {
                // Get Output
                const output = showResults(data.events.event[i]);
                // Display Results
                $('.search-results').append(output);
            }
        });
    }//end if statement
  }

//format and convert time from 24hr to 12/ display date
//'MMMM Do YYYY, h:mm:ss a');
function timeConverter(time) {
  return moment(time).format('MMMM Do YYYY, h:mm a');
}

//Build Output
function showResults(item) {
    let eventID = item.id;
    let title = item.title;
    let eventURL = item.url;
    let urlImage = item.image ? item.image.medium.url : '';
    // let urlImage = item.image.medium.url;
    let description = item.description;
    let eventStart = timeConverter(item.start_time);
    let venueName = item.venue_name;
    let venueAddress = item.venue_address + ", " + "<br>" + item.city_name + " " + item.region_abbr;
    let venueURL = item.venue_url;
    let eventLat = item.latitude;
    let eventLng = item.longitude;

   const output = `
      <li>
        <div class="thumbnail-40">
          <img src="${urlImage}" alt="${title}">
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
            <strong>Date/Time: </strong>
            ${eventStart}
          </p>
        </div>
      </li>
    <div class="clearfix"></div>`;
 return output;
}

function displayMapMarkers(data) {
    let markersData = data.events.event;
    let bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markersData.length; i++) {
        let venueURL = markersData[i].venue_url;
        let eventLat = markersData[i].latitude;
        let eventLng = markersData[i].longitude;
        let description = markersData[i].description;
        let eventStart = timeConverter(markersData[i].start_time);
        let venueName = markersData[i].venue_name;
        let postalCode = markersData[i].postal_code;
        let latlng = new google.maps.LatLng(markersData[i].latitude, markersData[i].longitude);
        let title = markersData[i].title;
        let venueAddress = markersData[i].venue_address + ", " + markersData[i].city_name + " " + markersData[i].region_abbr;
        newMarker(latlng, title, venueName, venueAddress, postalCode, description, venueURL);

        bounds.extend(latlng);
    }
    map.fitBounds(bounds);
}

function newMarker(latlng, title, venueName, venueAddress, postalCode, description, venueURL) {
    const marker = new google.maps.Marker({
        map: map,
        position: latlng,
        title: title,
        animation: google.maps.Animation.DROP
    });

    const clicked = false;

    google.maps.event.addListener(marker, "mouseover", function(e) {
        if (!clicked) {
            const popUpContent = `<div><strong>${title}</strong><br><strong>@${venueName}</strong><br>${venueAddress} ${postalCode}</div>`;
            infoWindow.setContent(popUpContent);
            infoWindow.open(map, marker);
        }
    });
    google.maps.event.addListener(marker, "mouseout", function(e) {
        if (!clicked) {
            infoWindow.close();
        }
    });

    google.maps.event.addListener(marker, "click", function(e) {
        clicked = true;
        const popUpContent = `<div><strong>${title}</strong><br><a href="${venueURL}"><strong>@${venueName}</strong></a><br><a href="http://maps.google.com/?q=${venueAddress}">${venueAddress}</a><br>${description}</div>`;
        infoWindow.setContent(popUpContent);
        infoWindow.open(map, marker);
    });
    google.maps.event.addListener(infoWindow, 'closeclick', function(e) {
        clicked = false;
    })
}

function initializeMap(data) {
    const mapOptions = {
        center: new google.maps.LatLng(40.014984, -105.270546),
        zoom: 9,
        mapTypeId: 'roadmap',
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function() {
      infoWindow.close();
    });
    displayMapMarkers(data);
}

// Show/Hide Search Form
function eventSearchTwo() {
    // console.log(eventSearchTwo)
    $('.new-search-button-2').on('click', function() {
        $('.search-results').html(''); // Clear Results
        $('.display-results-container').hide();
        $('.new-search-button').hide();
        $('.search-section').show();
        $('.main').show();
    });
}

function showMap() {
    $('.search-button').on('click', function() {
        $('#map').show();
    });
}

$('document').ready(function() {
    $(window).load(function() {
        $(".pre-loader").fadeOut("slow");
    })
    $('.search-button').on('click', function(e) {
        e.preventDefault();
        getApiData();
    })
    showMap();
    eventSearchTwo();
})
