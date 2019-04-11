var app;
var starting_center1 = L.latLng(44.9430, -93.1895);
var starting_center2 = L.latLng(40.7590, -73.9845);
var openAQRequest = null;

init = function(){
    app = new Vue({
        el: '#app',
        data:{
            map1:null,
            map2:null,
            center1:starting_center1,
            center2:starting_center2,
            unique_markers:[],
            map2_marker_objects:[],
            location1: null,
            location2:null
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
                    maxZoom: 16,
                    minZoom: 9,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoibmVsczQ5MjkiLCJhIjoiY2p1NGVqYjN3MHg0ejRkcnYzajRzOWhzYSJ9.EzP1fdcqxGe4aVr2_NqK1w'
                }).addTo(this.map2);   
            },
            mounted() {
                const self = this;
                axios
                .get('https://nominatim.openstreetmap.org/?format=json&addressdetails=1&q='+self.location1+'&format=json&limit=1')
                .then(response => {
                    self.center1.lat = response.data[0].lat;
                    self.center1.lng = response.data[0].lon;
                })
                console.log(this.center1);
                this.map1.panTo(this.center1);
            },
            mounted2() {
                const self = this;
                axios
                .get('https://nominatim.openstreetmap.org/?format=json&addressdetails=1&q='+self.location2+'&format=json&limit=1')
                .then(response => {
                    self.center2.lat = response.data[0].lat;
                    self.center2.lng = response.data[0].lon;
                })
                console.log(this.center2);
                this.map2.panTo(this.center2);
            },  
        }
    });
    app.initMap();
    trackMap();
    OpenAQSearch();
}
function OpenAQSearch(){
    console.log("sending request");
    //setup all vars to be plugged into the request url
    var d = new Date();
    var date_to = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    d.setDate(d.getDate() - 30);
    var date_from = (d).getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    var bounds = app.map2.getBounds();
    var radius = app.map2.distance([bounds._northEast.lat,bounds._northEast.lng],[bounds._southWest.lat, bounds._southWest.lng])/2;
    var request = {
        url: "https://api.openaq.org/v1/measurements?order_by=location?date_from="+date_from+"&date_to="+date_to+"&coordinates="+app.center2.lat+","+app.center2.lng+"&radius="+radius+"&limit=10000",
        dataType: "json",
        success: FillUniqueMarkers
    };
    console.log(request.url);
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
    //drag
    app.map2.addEventListener("dragend",function(){
        if (openAQRequest!=null){
            clearTimeout(openAQRequest);
        }
        openAQRequest = setTimeout(function(){ 
            DeleteOldMarkers();
            OpenAQSearch();
            openAQRequest=null;
        }, 200);
    });
    app.map2.addEventListener("zoomend",function(){
        if (openAQRequest!=null){
            clearTimeout(openAQRequest);
        }
        console.log("zoomend");
        openAQRequest = setTimeout(function(){ 
            DeleteOldMarkers();
            OpenAQSearch();
            openAQRequest=null;
            console.log("in timeout")
        }, 200);
    });
}
/*  latSearch and lngSearch functions update the maps position
    when the user changes the input fields for lat and longitude    */
function latSearch1(event){
    setTimeout(function(){ 
            app.map1.panTo(app.center1);
        }, 600);
}
function lngSearch1(event){
    setTimeout(function(){ 
            app.map1.panTo(app.center1);
        }, 600);
}
function latSearch2(event){
    setTimeout(function(){ 
            app.map2.panTo(app.center2);
        }, 600);
}
function lngSearch2(event){
    setTimeout(function(){ 
            app.map2.panTo(app.center2);
        }, 600);
}
function locSearch1(event){
    setTimeout(function(){
           app.mounted();  
    },1000);
}

function locSearch2(event){
    setTimeout(function(){
        app.mounted2();   
    },1000);
}
function FillUniqueMarkers(data){
    console.log(data.results);
    var num_new_markers=0;
    //var unique_markers = [];
    for(var i=0; i < data.results.length; i++){
        
        //if there is no markers in the array, add the first
        if(app.unique_markers.length==0){
            var newmarker = new unique_marker(data.results[i].coordinates.latitude, data.results[i].coordinates.longitude);
            newmarker.addParameter(data.results[i].parameter,data.results[i].value);
            app.unique_markers.push(newmarker);
            num_new_markers++;
        }

        //check that if the new marker already exists in the unique_markers
        var exists = false;
        for(var j = 0; j < app.unique_markers.length; j++) {
            if (app.unique_markers[j].coordinates.latitude == data.results[i].coordinates.latitude && app.unique_markers[j].coordinates.longitude == data.results[i].coordinates.longitude){
                exists = true;
                app.unique_markers[j].addParameter(data.results[i].parameter,data.results[i].value);
            }
        }
        if(!exists){
            var newmarker = new unique_marker(data.results[i].coordinates.latitude, data.results[i].coordinates.longitude);
            newmarker.addParameter(data.results[i].parameter,data.results[i].value);
            app.unique_markers.push(newmarker);
            num_new_markers++;
        }
    }
    if(num_new_markers>0){
        console.log("adding "+num_new_markers+"new markers");
        ShowMarkers(num_new_markers);
    }
}
function ShowMarkers(num_new_markers){
    var num_old_markers = app.map2_marker_objects.length;
    for(var i = 0; i<num_new_markers; i++){
        var marker = addMarker([app.unique_markers[i+num_old_markers].coordinates.latitude,app.unique_markers[i+num_old_markers].coordinates.longitude], app.map2)
            .bindPopup(GetPopupString(app.unique_markers[i+num_old_markers]));
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        app.map2_marker_objects.push(marker);
    }
    console.log("currently have :"+app.unique_markers.length + " markers");
}
function GetPopupString(unique_marker){
    var retstring="";
    if(unique_marker.pm25 != undefined && unique_marker.pm25.length>0){
        retstring = "pm25: " + getAvg(unique_marker.pm25) + "µg/m³" + "<br>" + retstring;
    }
    if(unique_marker.pm10 != undefined && unique_marker.pm10.length>0){
        retstring = "pm10: " + getAvg(unique_marker.pm10) + "ppm" + "<br>" + retstring;
    }
    if(unique_marker.no2!= undefined && unique_marker.no2.length>0){
        retstring = "no2: " + getAvg(unique_marker.no2) + "ppm" + "<br>" + retstring;
    }
    if(unique_marker.o3!= undefined && unique_marker.o3.length>0){
        retstring = "o3: " + getAvg(unique_marker.o3) + "ppm" + "<br>" + retstring;
    }
    if(unique_marker.co!= undefined && unique_marker.co.length>0){
        retstring = "co: " + getAvg(unique_marker.co) + "ppm"  + "<br>"+ retstring;
    }
    if(unique_marker.bc!= undefined && unique_marker.bc.length>0){
        retstring = "bc: " + getAvg(unique_marker.pm25) + "bc"  + "<br>"+ retstring;
    }
    return retstring;
}
function getAvg(value){
    ret = 0;
    for(var i = 0; i<value.length; i++){
        ret = ret + value[i];
    }
    ret = ret/value.length
    return Math.round(ret * 10000) / 10000;
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

/*   Loops    */
DeleteOldMarkers = function(){
    var num_deleted=0;//for printing purposes only
    var i = app.unique_markers.length
    while (i--) {
        if(!app.map2.getBounds().contains([app.unique_markers[i].coordinates.latitude,app.unique_markers[i].coordinates.longitude])){ 
            app.unique_markers.splice(i, 1);
            app.map2.removeLayer(app.map2_marker_objects[i]);
            app.map2_marker_objects.splice(i,1);
            num_deleted++;
        } 
    }
    console.log("deleted :"+num_deleted + " markers");
    console.log("currently have :"+app.unique_markers.length + " markers");
}
fullscreen1 = function(){
    document.getElementById("map2_and_nav").style.display="none";
    document.getElementsByClassName("maps")[0].style.width="100vw";
    document.getElementById("fullscreen1").style.display="none";
    document.getElementById("halfscreen1").style.display="inline";
    app.map1.invalidateSize();
    app.map2.invalidateSize();
    halfscreen2();
    //DeleteOldMarkers1();
}
halfscreen1 = function(){
    document.getElementsByClassName("maps")[0].style.width="50vw";
    document.getElementById("halfscreen1").style.display="none";
    document.getElementById("fullscreen1").style.display="inline";
    document.getElementById("map2_and_nav").style.display="table-cell";
    app.map1.invalidateSize();
    app.map2.invalidateSize();
    //DeleteOldMarkers1();
}
fullscreen2 = function(){
    document.getElementById("map1_and_nav").style.display="none";
    document.getElementsByClassName("maps")[1].style.width="100vw";
    document.getElementById("fullscreen2").style.display="none";
    document.getElementById("halfscreen2").style.display="inline";
    app.map1.invalidateSize();
    app.map2.invalidateSize();
    //DeleteOldMarkers();
}
halfscreen2 = function(){
    document.getElementsByClassName("maps")[1].style.width="50vw";
    document.getElementById("halfscreen2").style.display="none";
    document.getElementById("fullscreen2").style.display="inline";
    document.getElementById("map1_and_nav").style.display="table-cell";
    app.map1.invalidateSize();
    app.map2.invalidateSize();
    //DeleteOldMarkers();
}

