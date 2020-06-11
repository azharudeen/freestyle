var map;
var geocoder;
//var bounds = new google.maps.LatLngBounds();
var markersArray = [];

//var origin1 = new google.maps.LatLng(55.930, -3.118);
var origin;
var destination;
//var destinationB = new google.maps.LatLng(50.087, 14.421);

var destinationIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=D|FF0000|000000';
var originIcon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=O|FFFF00|000000';

function initialize() {
  var opts = {
    //center: new google.maps.LatLng(9.93123, 76.26730),
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), opts);
  geocoder = new google.maps.Geocoder();

  var options = {
    types: ['(cities)'],//show cities only
    componentRestrictions: { country: 'in' }//india only
  };

  var input = document.getElementById('source');
  //var autocomplete = new google.maps.places.Autocomplete(input);

  var autocomplete = new google.maps.places.Autocomplete(input, options);
  var input1 = document.getElementById('dest');
  var autocomplete = new google.maps.places.Autocomplete(input1, options);

  var input3 = document.getElementById('pop-source');
  //var autocomplete = new google.maps.places.Autocomplete(input);

  var autocomplete = new google.maps.places.Autocomplete(input3, options);
  var input4 = document.getElementById('pop-dest');
  var autocomplete = new google.maps.places.Autocomplete(input4, options);

  var inputPopSource1 = document.getElementById('MC_from_1');
  var autocomplete = new google.maps.places.Autocomplete(inputPopSource1, options);
  var inputPopSource2 = document.getElementById('MC_from_2');
  var autocomplete = new google.maps.places.Autocomplete(inputPopSource2, options);
  var inputPopSource3 = document.getElementById('MC_from_3');
  var autocomplete = new google.maps.places.Autocomplete(inputPopSource3, options);
  var inputPopSource4 = document.getElementById('MC_from_4');
  var autocomplete = new google.maps.places.Autocomplete(inputPopSource4, options);
  var inputPopSource5 = document.getElementById('MC_from_5');
  var autocomplete = new google.maps.places.Autocomplete(inputPopSource5, options);
  var inputPopSource6 = document.getElementById('MC_from_6');
  var autocomplete = new google.maps.places.Autocomplete(inputPopSource6, options);

  var inputPopDestination1 = document.getElementById('MC_to_1');
  var autocomplete = new google.maps.places.Autocomplete(inputPopDestination1, options);
  var inputPopDestination2 = document.getElementById('MC_to_2');
  var autocomplete = new google.maps.places.Autocomplete(inputPopDestination2, options);
  var inputPopDestination3 = document.getElementById('MC_to_3');
  var autocomplete = new google.maps.places.Autocomplete(inputPopDestination3, options);
  var inputPopDestination4 = document.getElementById('MC_to_4');
  var autocomplete = new google.maps.places.Autocomplete(inputPopDestination4, options);
  var inputPopDestination5 = document.getElementById('MC_to_5');
  var autocomplete = new google.maps.places.Autocomplete(inputPopDestination5, options);
  var inputPopDestination6 = document.getElementById('MC_to_6');
  var autocomplete = new google.maps.places.Autocomplete(inputPopDestination6, options);



}

function checkDistance() {
  var totalDistance = 0;
  var i;
  var src = document.getElementById('source').value;
  var dest = document.getElementById('dest').value;
  if (!(src == '' && dest == '')) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [src],
        destinations: [dest],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status != google.maps.DistanceMatrixStatus.OK) {
          alert('Error was: ' + status);
        } else {
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;
          deleteOverlays();

          for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            addMarker(origins[i], false);
            for (var j = 0; j < results.length; j++) {
              addMarker(destinations[j], true);
              var kmNumber = results[j].distance.text;
              kmNumber = kmNumber.replace(" km", "");
              if (!kmNumber.indexOf(",") > -1) {
                kmNumber = kmNumber.replace(",", "");
              }
              totalDistance = totalDistance + parseInt(kmNumber);
              sessionStorage.setItem("totalDistanceAll", totalDistance);
              location.href = "details.html";
            }
          }
        }
      });
  }
  for (i = 1; i <= 6; i++) {
    var s1 = document.getElementById(`MC_from_${i}`).value;
    var d1 = document.getElementById(`MC_to_${i}`).value;
    if (!(s1 == '' && d1 == '')) {
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [s1],
          destinations: [d1],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status != google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
          } else {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
            deleteOverlays();

            for (var i = 0; i < origins.length; i++) {
              var results = response.rows[i].elements;
              addMarker(origins[i], false);
              for (var j = 0; j < results.length; j++) {
                addMarker(destinations[j], true);
                var kmNumber = results[j].distance.text;
                kmNumber = kmNumber.replace(" km", "");
                if (!kmNumber.indexOf(",") > -1) {
                  kmNumber = kmNumber.replace(",", "");
                }
                totalDistance = totalDistance + parseInt(kmNumber);
                sessionStorage.setItem("totalDistanceAll", totalDistance);
                location.href = "details.html";
              }
            }
          }
        });
    }
  }
}

function calculateDistances() {
  origin = document.getElementById('source').value;
  destination = document.getElementById('dest').value;
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, calcDistance);
}

function calcDistance(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    deleteOverlays();

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      addMarker(origins[i], false);
      for (var j = 0; j < results.length; j++) {
        addMarker(destinations[j], true);
        outputDiv.innerHTML += origins[i] + ' to ' + destinations[j]
          + ': ' + results[j].distance.text + ' in '
          + results[j].duration.text + '<br>';
      }
    }
  }
}

function addMarker(location, isDestination) {
  var icon;
  if (isDestination) {
    icon = destinationIcon;
  } else {
    icon = originIcon;
  }
  geocoder.geocode({ 'address': location }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      bounds.extend(results[0].geometry.location);
      map.fitBounds(bounds);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markersArray.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: '
        + status);
    }
  });
}

function deleteOverlays() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

google.maps.event.addDomListener(window, 'load', initialize);
