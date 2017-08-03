var map;

var model=function(){
     this.locations = ko.observableArray([
          {title: 'Egypt pyramds', location: {lat: 29.979235, lng: 31.134202}},
          {title: 'Egyption museum', location: {lat: 30.047848, lng: 31.233637}},
          {title: 'Tahrir square', location: {lat: 30.044456, lng: 31.235646}},
          {title: 'Abdeen Palace Museum', location: {lat: 30.043018, lng: 31.247778}},
          {title: 'Opera Land', location: {lat: 30.042684, lng:  31.223981}},
          {title: 'Smart village', location: {lat: 30.073165, lng: 31.017884}}
        ]);
    this.markers = ko.observableArray();
};

// Create a new blank array for all the listing markers.
var markers = model.markers
function initMap() {
// Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
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
  ]
,
    mapTypeControl: false
});
// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
   var locations = model.locations;
    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
       var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });
    }
    
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
var imagesrc = '3.jpg';
function populateInfoWindow(marker, infowindow) {
// Check to make sure the infowindow is not already opened on this marker.
if (infowindow.marker != marker) {
  infowindow.marker = marker;

  infowindow.setContent('<div>' + marker.title + '</div>');
  infowindow.setContent('<div> <img src="' + imagesrc + '"/></div>');
  infowindow.open(map, marker);
  // Make sure the marker property is cleared if the infowindow is closed.
  infowindow.addListener('closeclick', function() {
    infowindow.marker = null;
  });
}
}
// This function will loop through the markers array and display them all.
function showListings() {
var bounds = new google.maps.LatLngBounds();
// Extend the boundaries of the map for each marker and display the marker
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(map);
  bounds.extend(markers[i].position);
}
map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
for (var i = 0; i < markers.length; i++) {
  markers[i].setMap(null);
}
}

var octupus={
    filterList : [],
    init : function(){
        initMap();
        viewlocations.init();
        showListings();
        filter.init();
        this.filterList = model.locations;
    },
    getAllLocations : function(){
        return model.locations;
    },
    gitMarkers : function(){
        return model.markers;
    },
    getFilterList : function(subString){
        if (subString == null){
            return this.gitAllLocations();
        }
        var locations = this.gitAllLocations();
        var length = locations().length;
        this.filterList = []
        for(var i = 0; i < length;  i++){
            if (locations()[i].title.startsWith(subString))
                {
                    this.filterList.push(locations()[i]);
                }
        }
        return this.filterList;
    }
};

var viewlocations ={
    init:function(){
        this.search = document.getElementById('search');
        this.places = document.getElementById('places');
        this.key = 'd9effb32e73cbf6f0145df0cff955222';
        this.largeInfowindow = new google.maps.InfoWindow();
        viewlocations.render();
    },
    render : function(){
        var locations,location,li,markers;
        locations = octupus.filterList;
        markers = octupus.gitMarkers();
        for(var i = 0; i < locations.length ; i++ ){
            location = locations[i];
            li = document.createElement('li');
            li.innerHTML = location.title;
            // Using jQuery
            $.ajax({
                url : "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+this.key+"&format=json&nojsoncallback=1&text="+location.title+"&extras=url_s&max=1",
                dataType : 'json',
                type : 'POST',
                success : function(data) {
                    var marker = new google.maps.Marker({
                    position : location.location,
                    title : location.title,
                    animation : google.maps.Animation.DROP,
                    id: i
                  });
                markers.push(marker);
                marker.addListener('click', function() {
                    populateInfoWindow(this, this.largeInfowindow);
                });
                }
            } );
            li.addEventListener('click',(function(Copylocation){
                return function(){
                      window.alert(Copylocation.title)
                }
            })(location));
            this.places.appendChild(li);
        }
    }
};

var filter ={
    init : function(){
        $('#filter').keyup(function(){
           octupus.getFilterList(this.val());
        });
    }
    
    
};

ko.applyBindings(new model());