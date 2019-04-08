var app;
var starting_center1 = L.latLng(44.9430, -93.1895);
var starting_center2 = L.latLng(40.7590, -73.9845);

init = function(){
    app = new Vue({
        el: '#app',
        data:{
            map1:null,
            map2:null,
            center1:starting_center1,
            center2:starting_center2,
            unique_markers:[]
        },
        //computed - loop over data and 
        methods: {
            initMap(){
                this.map1 = L.map('map1id').setView(starting_center1, 13);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 30,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoibmVsczQ5MjkiLCJhIjoiY2p1NGVqYjN3MHg0ejRkcnYzajRzOWhzYSJ9.EzP1fdcqxGe4aVr2_NqK1w'
                }).addTo(this.map1);      

                this.map2 = L.map('map2id').setView(starting_center2, 13);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 30,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoibmVsczQ5MjkiLCJhIjoiY2p1NGVqYjN3MHg0ejRkcnYzajRzOWhzYSJ9.EzP1fdcqxGe4aVr2_NqK1w'
                }).addTo(this.map2);   
            },  
        }
    });
    app.initMap();
    trackMap();
    OpenAQSearch();
}
function OpenAQSearch()
{
    //setup all vars to be plugged into the request url
    var d = new Date();
    var date_from;
    var date_to = Date.now();
    var longitude;
    var latitude;
    var radius;
    var request = {

        url: "https://api.openaq.org/v1/measurements?order_by=location?date_from=2019-03-01&date_to=2019-04-07&coordinates=40.7590%2C-73.9845&radius=50000",
        dataType: "json",
        success: FillUniqueMarkers
    };
    $.ajax(request);
}
trackMap = function(){
    app.map1.addEventListener("move",function(){
        setTimeout(function(){ 
            app.center1=app.map1.getCenter();
        }, 200);
    });
    app.map2.addEventListener("move",function(){
        setTimeout(function(){ 
            app.center2=app.map2.getCenter();
        }, 200);
    });
}

/*  latSearch and lngSearch functions update the maps position
    when the user changes the input fields for lat and longitude    */
function latSearch1(event)
{
    setTimeout(function(){ 
            app.map1.panTo(app.center1);
        }, 600);
}
function lngSearch1(event)
{
    setTimeout(function(){ 
            app.map1.panTo(app.center1);
        }, 600);
}
function latSearch2(event)
{
    setTimeout(function(){ 
            app.map2.panTo(app.center2);
        }, 600);
}
function lngSearch2(event)
{
    setTimeout(function(){ 
            app.map2.panTo(app.center2);
        }, 600);
}
function FillUniqueMarkers(data){
    console.log(data.results);
    app.unique_markers
    //var unique_markers = [];
    for(var i=0; i < data.results.length; i++){
        /*var marker = addMarker([data.results[i].coordinates.latitude,data.results[i].coordinates.longitude], app.map2)
            .bindPopup(
                data.results[i].parameter
                +" : " 
                +data.results[i].value
                +data.results[i].unit
            );
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        console.log([data.results[i].coordinates.latitude, data.results[i].coordinates.longitude]);*/

        //if there is no markers in the array, add the first
        if(app.unique_markers.length==0){
            var newmarker = new unique_marker(data.results[i].coordinates.latitude, data.results[i].coordinates.longitude);
            newmarker.addParameter(data.results[i].parameter,data.results[i].value);
            app.unique_markers.push(newmarker);
            
        }

        //check that if the new marker already exists in the unique_markers
        var exists = false;
        for(var j = 0; j < app.unique_markers.length; j++) {
            if (app.unique_markers[j].coordinates.latitude == data.results[i].coordinates.latitude && app.unique_markers[j].coordinates.longitude == data.results[i].coordinates.longitude){
                exists = true;
                app.unique_markers[j].addParameter(data.results[i].parameter,data.results[i].value);
                console.log(exists);
            }
        }
        if(!exists){
            var newmarker = new unique_marker(data.results[i].coordinates.latitude, data.results[i].coordinates.longitude);
            newmarker.addParameter(data.results[i].parameter,data.results[i].value);
            app.unique_markers.push(newmarker);
        }
    }
    console.log(app.unique_markers);
}
function ShowMarkers(unique_markers){
    for(var i = 0; i<unique_markers.length; i++){

    }
}
function unique_marker(lat, lng){
    this.coordinates = [];
    this.coordinates.latitude = lat;
    this.coordinates.longitude = lng;
    this.pm25 = [];
    this.pm10 = [];
    this.no2 = [];
    this.o3 = [];
    this.co = [];
    this.bc = [];
    this.addParameter = function (parameter,value){
        if(parameter == "pm25"){this.pm25.push(value);}
        if(parameter == "pm10"){this.pm10.push(value);}
        if(parameter == "no2"){this.no2.push(value);}
        if(parameter == "o3"){this.o3.push(value);}
        if(parameter == "co"){this.co.push(value);}
        if(parameter == "bc"){this.bc.push(value);}
    }
}
addMarker = function([lat,lng],map){
    var marker = L.marker([lat, lng]).addTo(map);
    return marker;
}