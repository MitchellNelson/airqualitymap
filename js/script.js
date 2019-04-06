var app;
var map;
init = function(){
 
    
    app = new Vue({
        el: '#app',
        data:{
            lat:51.5,
            long: -0.09
        },
        computed: {
            center: function () {
                return this.lat
            }
        },
        watch: {
          center: function(){
            console.log('changed');
          }
        }
    });
    initMap();
}

initMap = function(){
    map = L.map('mapid').setView([51.505, -0.09], 30);
    var marker = addMarker(51.5, -0.09, map);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibmVsczQ5MjkiLCJhIjoiY2p1NGVqYjN3MHg0ejRkcnYzajRzOWhzYSJ9.EzP1fdcqxGe4aVr2_NqK1w'
    }).addTo(map);       
    
}

addMarker = function(lat,long, map){
    return L.marker([lat, long]).addTo(map);
}