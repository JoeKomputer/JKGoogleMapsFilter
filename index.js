var map;
var infoWindow;
var service;
var checked = [];
  var markers = [];
var markersArray = [];
var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
 var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
$('input[type=checkbox]:checked').each(function(){
  checked.push($(this).val());
  });
console.log(checked);

 //checks if checkboxes are checked and adds them to array
$('input[type=checkbox]').click(function(){
  checked= [];
$('input[type=checkbox]:checked').each(function(){
  checked.push($(this).val());
  });
//findRequest(window.latlng, window.position);
 clearOverlays();
  performSearch(checked);
});
function initialize(position) {
   var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: latlng,
    zoom: 15,
    styles: [
      {
        stylers: [
          { visibility: 'simplified' }
        ]
      },
      {
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
      }
    ]
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
  google.maps.event.addListener(searchBox, 'places_changed', searchLocation);
}
//searches based on current location and adds markers
function performSearch() {
  var request = {
    bounds: map.getBounds(),
    radius:500,
    types: checked
  };
  console.log(checked);
  service.radarSearch(request, callback);
}
 //searches based on searchbox location and adds markers
function searchLocation() {
    console.log('searching new location');
    var places = searchBox.getPlaces();

    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
       var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });
  var request = {
    location: place.geometry.location,
    radius: 500,
    types: checked
  };

   var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
      bounds.extend(place.geometry.location);
      markers.push(marker);
    }
    map.fitBounds(bounds);
    map.setZoom(15);
  };
function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  for (var i = 0, result; result = results[i]; i++) {
    createMarker(result);
  }
}
function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
  console.log("cleared"+markersArray);
}
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      // Star
      path: 'M 0,-24 6,-7 24,-7 10,4 15,21 0,11 -15,21 -10,4 -24,-7 -6,-7 z',
      fillColor: '#ffff00',
      fillOpacity: 1,
      scale: 1/4,
      strokeColor: '#bd8d2c',
      strokeWeight: 1
    }
  });
markersArray.push(marker);
var request = { reference: place.reference };
  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(request, function(details, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        alert(status);
        return;
      }
      infoWindow.setContent(details.name + "<br />" + details.formatted_address +"<br />" + '<div id="bodyContent">' + "<br />" + '<p>Custom View Can Go Here'  + details.formatted_phone_number);
      infoWindow.open(map, marker);
    });
  });
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}

//google.maps.event.addDomListener(window, 'load', initialize);
navigator.geolocation.getCurrentPosition(initialize);