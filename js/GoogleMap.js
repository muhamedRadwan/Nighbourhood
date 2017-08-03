var map;


var model  = {
	locations : [
        {title: 'Egypt pyramds', location: {lat: 29.979235, lng: 31.134202}},
        {title: 'Egyptian Museum', location: {lat: 30.047848, lng: 31.233637}},
        {title: 'Tahrir square', location: {lat: 30.044456, lng: 31.235646}},
        {title: 'Abdeen Palace Museum', location: {lat: 30.043018, lng: 31.247778}},
        {title: 'Cairo Opera House', location: {lat: 30.042684, lng:  31.223981}},
        {title: 'Egypt Smart-Village', location: {lat: 30.073165, lng: 31.017884}}
    ],
    markers : []
};






var viewModel = {
		locations : ko.observableArray(model.locations),
		filter : ko.observable("")
	};


// Fillter Locations 
viewModel.filteredItems = ko.computed(function () {
    var filter = this.filter().toLowerCase();
    if (!filter) {
        return this.locations();
    } else {
		return ko.utils.arrayFilter(this.locations(), function (item) {
			// Check If Title start With THe Word That USer ENter OR not
			return item.title.toLowerCase().startsWith(filter);
        });
    }
}, viewModel);

viewModel.filteredItems.subscribe(function () {
    renderMap();
});

// Function That Called When USer Click On  Any Item Of The List
var clickMe = function (title) {
    var marker = "";
    //  get The Marker 
    markers.forEach(function(item){
        if (item.title == title )
            marker = item;
    });
    if (marker !== "")
        // Trigger it :) (Simulate the Click of User)
        google.maps.event.trigger(marker, 'click');
}; 


// Create a new blank array for all the listing markers.
var markers = model.markers;
function initMap() {
// Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.047848, lng: 31.233637},
        zoom: 13,
        styles: [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#fff'}]
    }
  ],
    mapTypeControl: false
});
     renderMap();
}


function renderMap(){
    
    //Delete All Markers From Map if any 
    markers.forEach(function(marker){
       marker.setMap(null);
    });
    markers= [];
    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = viewModel.filteredItems();
    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position : position,
            title : title,
            animation : google.maps.Animation.DROP,
            id: i,
        });
        markers.push(marker);
      	addListener(marker,largeInfowindow);
        
    }
    showListingsWihBounds();
}

// Add Event Listener to Marker
function addListener(marker,largeInfowindow){
	 marker.addListener('click', function() {
     populateInfoWindow(this, largeInfowindow);
   });
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
// This function will loop through the markers array and display them all.
function showListingsWihBounds() {
if (markers.length === 0){
    return ;
}
var bounds = new google.maps.LatLngBounds();
// Extend the boundaries of the map for each marker and display the marker
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(map);
  bounds.extend(markers[i].position);
}

map.fitBounds(bounds);
}




function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          markers.forEach(function(marker){
              marker.setAnimation(null);
          });
          var key = 'd9effb32e73cbf6f0145df0cff955222';
          infowindow.marker = marker;
          // Get Images For place from Fliker API
          $.ajax({
                url : "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+key+"&format=json&nojsoncallback=1&text="+marker.title+"&extras=url_s&max=1",
                dataType : 'json',
                type : 'POST',
                success : function(data) {
                    // Asign A Data And Title To InfoWindow
                    var content = "<div class='marker'><img class='markerImage' src="+data.photos.photo[0].url_s+"><p class='h3'>"+ marker.title +"</p></div>";
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                    }
        }).fail(function(){
            alert("Error in Flickr API Call Please Check Your Connection");
        });
        // Animate The Marker 
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.marker.setAnimation(null);
            infowindow.setMarker = null;
        });
    }
} 


// Dispaly Error Message IF Google Map Get Error

function error(){
    alert("Error in Google Map API Call Please Check Your Connection");
}



ko.applyBindings(viewModel);