var app;

var starting_center1 = L.latLng(44.9430, -93.1895);
var starting_center2 = L.latLng(39.916451274939206, 116.38215586686088);
var starting_location1 = "St. Paul";
var starting_location2 = "Bejing";
var openAQRequest = null;
var locationRequest = null;

init = function(){
    app = new Vue({
        el: '#app',
        data:{
            map1:null,
            map2:null,
            center1:starting_center1,
            center2:starting_center2,
            unique_markers1:[],
            unique_markers2:[],
            location1: starting_location1,
            location2: starting_location2,
            checkedParams1: ["pm25","pm10","no2","o3","bc","co"],
            checkedParams2: ["pm25","pm10","no2","o3","bc","co"],
            heat1: false,
            heat2 : false
        },
        computed:{
            avg_pm25 :function(){
                
            }
        },
        methods: {
            initMap(){
                this.map1 = L.map('map1id').setView(starting_center1, 13);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 16,
                    minZoom: 9,
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
                this.map1.panTo(this.center1);
                OpenAQSearch1();
            },
            mounted2() {
                const self = this;
                axios
                .get('https://nominatim.openstreetmap.org/?format=json&addressdetails=1&q='+self.location2+'&format=json&limit=1')
                .then(response => {
                    self.center2.lat = response.data[0].lat;
                    self.center2.lng = response.data[0].lon;
                })
                this.map2.panTo(this.center2);
                OpenAQSearch2();

            },
            getClassO3(a) {
            if ( a<=.054) {
                this.class="good"
                return this.class
              }
              else if (a>.055 && a<=.070) {
                this.class = "moderate"
                return this.class
              }
              else if (a>.071 && a<=.085){
                this.class = "uhsg"
                return this.class
              }
              else if (a>.086 && a<=.105){
                this.class = "unhealthy"
                return this.class
              }
              else if (a>.106 && a<=.200){
                this.class = "veryUnhealthy"
                return this.class
              }
              else if (a> .200){
                this.class = "hazardous"
                return this.class
              }
            },
            getClassPM25(a) {
            if (a<=12) {
                this.class="good"
                return this.class
              }
              else if (a>12.1 && a<= 35.4) {
                this.class = "moderate"
                return this.class
              }
              else if (a> 35.5 && a<= 55.4){
                this.class = "uhsg"
                return this.class
              }
              else if (a>55.5 && a<= 150.4){
                this.class = "unhealthy"
                return this.class
              }
              else if (a>150.5 && a<= 250.4){
                this.class = "veryUnhealthy"
                return this.class
              }
              else if (a> 250.4){
                this.class = "hazardous"
                return this.class
              }
            }, 
            getClassPM10(a) {
            if ( a<=54) {
                this.class="good"
                return this.class
              }
              else if (a>55 && a<= 154) {
                this.class = "moderate"
                return this.class
              }
              else if (a> 155 && a<= 254){
                this.class = "uhsg"
                return this.class
              }
              else if (a>255 && a<= 354){
                this.class = "unhealthy"
                return this.class
              }
              else if (a>355 && a<= 424){
                this.class = "veryUnhealthy"
                return this.class
              }
              else if( a >424) {
                this.class = "hazardous"
                return this.class
              }
            }, 
            getClassCO(a) {
             if ( a<=4.4) {
                this.class="good"
                return this.class
              }
              else if (a>4.5 && a<= 9.4) {
                this.class = "moderate"
                return this.class
              }
              else if (a> 9.5 && a<= 12.4){
                this.class = "uhsg"
                return this.class
              }
              else if (a>12.5 && a<= 15.4){
                this.class = "unhealthy"
                return this.class
              }
              else if (a>15.5 && a<= 30.4){
                this.class = "veryUnhealthy"
                return this.class
              }
              else if (a>30.4){
                this.class = "hazardous"
                return this.class
              }
            }, 
            getClassNO2(a) {
            if ( a<=53) {
                this.class="good"
                return this.class
              }
              else if (a>54 && a<= 100) {
                this.class = "moderate"
                return this.class
              }
              else if (a> 101 && a<= 360){
                this.class = "uhsg"
                return this.class
              }
              else if (a>361 && a<= 649){
                this.class = "unhealthy"
                return this.class
              }
              else if (a>650 && a<= 1249){
                this.class = "veryUnhealthy"
                return this.class
              }
              else if (a>1249){
                this.class = "hazardous"
                return this.class
              }
            }  
        }
    });
    app.initMap();
    trackMap();
    OpenAQSearch1();
    OpenAQSearch2();
}
function OpenAQSearch1(){
    console.log("sending request");
    //setup all vars to be plugged into the request url
    var d = new Date();
    var date_to = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    d.setDate(d.getDate() - 30);
    var date_from = (d).getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    var bounds = app.map1.getBounds();
    var radius = app.map1.distance([bounds._northEast.lat,bounds._northEast.lng],[bounds._southWest.lat, bounds._southWest.lng])/2;
    var request = {
        url: "https://api.openaq.org/v1/measurements?order_by=date&date_from="+date_from+"&date_to="+date_to+"&coordinates="+app.center1.lat+","+app.center1.lng+"&radius="+radius+"&limit=10000&sort=desc",
        dataType: "json",
        success: function(data){
            FillUniqueMarkers(data,app.unique_markers1,app.map1);

        }
    };
    $.ajax(request);
}
function OpenAQSearch2(){
    console.log("sending request");
    //setup all vars to be plugged into the request url
    var d = new Date();
    var date_to = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    d.setDate(d.getDate() - 30);
    var date_from = (d).getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    var bounds = app.map2.getBounds();
    var radius = app.map2.distance([bounds._northEast.lat,bounds._northEast.lng],[bounds._southWest.lat, bounds._southWest.lng])/2;
    var request = {
        url: "https://api.openaq.org/v1/measurements?order_by=date&date_from="+date_from+"&date_to="+date_to+"&coordinates="+app.center2.lat+","+app.center2.lng+"&radius="+radius+"&limit=10000&sort=desc",
        dataType: "json",
        success: function(data){
            FillUniqueMarkers(data,app.unique_markers2, app.map2);
        }
    };
    console.log(request.url);
    $.ajax(request);
}
LocationFromLatLng1 = function(lat, lng) {
    const self = this;
    axios
    .get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+lat+'&lon='+lng)
    .then(response => {
        if(response.data.address.city!=undefined){
            app.location1 = response.data.address.city;
        }
    })
}
LocationFromLatLng2 = function(lat, lng) {
    const self = this;
    axios
    .get('https://nominatim.openstreetmap.org/reverse?format=json&lat='+lat+'&lon='+lng)
    .then(response => {
        if(response.data.address.city!=undefined){
            app.location2 = response.data.address.city;
        }
    })
}
trackMap = function(){
    app.map1.addEventListener("move",function(){
        setTimeout(function(){ 
            app.center1=app.map1.getCenter();
        }, 200);
    });
    app.map1.addEventListener("dragend",function(){
        if (openAQRequest!=null){
            clearTimeout(openAQRequest);
        }
        openAQRequest = setTimeout(function(){ 
            DeleteOldMarkers(app.unique_markers1, app.map1);
            OpenAQSearch1();
            LocationFromLatLng1(app.center1.lat, app.center1.lng);
            openAQRequest=null;
        }, 200);
    });
    app.map1.addEventListener("zoomend",function(){
        if (openAQRequest!=null){
            clearTimeout(openAQRequest);
        }
        console.log("zoomend");
        openAQRequest = setTimeout(function(){ 
            DeleteOldMarkers(app.unique_markers1, app.map1);
            OpenAQSearch1();
            LocationFromLatLng1(app.center1.lat, app.center1.lng);
            openAQRequest=null;
            console.log("in timeout")
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
            DeleteOldMarkers(app.unique_markers2, app.map2);
            OpenAQSearch2();
            LocationFromLatLng2(app.center2.lat, app.center2.lng);
            openAQRequest=null;
        }, 200);
    });
    app.map2.addEventListener("zoomend",function(){
        if (openAQRequest!=null){
            clearTimeout(openAQRequest);
        }
        console.log("zoomend");
        openAQRequest = setTimeout(function(){ 
            DeleteOldMarkers(app.unique_markers2, app.map2);
            OpenAQSearch2();
            LocationFromLatLng2(app.center2.lat, app.center2.lng);
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
        DeleteOldMarkers(app.unique_markers1,app.map1);
    },1000);
}

function locSearch2(event){
    setTimeout(function(){
        console.log("going to send a request") 
        app.mounted2();  
        DeleteOldMarkers(app.unique_markers2,app.map2);
    },1000);
}
function filter(event){
    setTimeout(function(){
        console.log("filtering")  
        DeleteFilteredPoints(app.unique_markers2,app.map2);
    },1500);
}
function FillUniqueMarkers(data,arr,map){
    console.log(data.results);
    var num_new_markers=0;

    //if there is no markers in the array, add the first
    if(arr.length== 0 && data.results.length>0){
        var newmarker = new unique_marker(data.results[0].coordinates.latitude, data.results[0].coordinates.longitude);
        newmarker.addDateEntry(data.results[0].date,data.results[0].parameter,data.results[0].value)//
        arr.push(newmarker);
        num_new_markers++;
    }
    
    //var unique_markers = [];
    for(var i=0; i < data.results.length; i++){
        //check that if the new marker already exists in the unique_markers
        var exists = false;
        for(var j = 0; j < arr.length; j++) {
            var date_exists = false;
            if (arr[j].coordinates.latitude == data.results[i].coordinates.latitude && arr[j].coordinates.longitude == data.results[i].coordinates.longitude){
                //loop through date entries specific for that unique location
                var length = arr[j].date_entries.length;
                for(var k = 0; k < length; k++){
                    if (arr[j].date_entries[k].date.local == data.results[i].date.local){
                        arr[j].date_entries[k].setParameter(data.results[i].parameter, data.results[i].value);
                        date_exists = true;
                        //console.log("break");
                        break;
                    }
                }
                if(!date_exists){
                    //console.log("in case!"+j)
                    arr[j].addDateEntry(data.results[i].date, data.results[i].parameter, data.results[i].value);
                }
                exists = true;
                break;  
            }
        }

        if(!exists){
            var newmarker = new unique_marker(data.results[i].coordinates.latitude, data.results[i].coordinates.longitude);
            newmarker.addDateEntry(data.results[i].date,data.results[i].parameter,data.results[i].value)//
            arr.push(newmarker);
            num_new_markers++;
        }
    }
    if(num_new_markers>0){
        console.log("adding "+num_new_markers+" new markers");
        ShowMarkers(num_new_markers, arr, map);
        console.log(map);
    }
}

function ShowMarkers(num_new_markers,arr, map){
    var num_old_markers = arr.length-num_new_markers;
    for(var i = 0; i<num_new_markers; i++){
       
        var marker = addMarker([arr[i+num_old_markers].coordinates.latitude,arr[i+num_old_markers].coordinates.longitude], map);
            //.bindPopup(GetPopupString(arr[i+num_old_markers]));
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });
        arr[i+num_old_markers].marker = marker;
    }
    console.log("map 1 currently has :"+arr.length + " markers");
}
function GetPopupString(unique_marker){
    var retstring="";
    var array = getArrays(unique_marker);
    if(array[0].length != 0){
        retstring = "pm25: " + getAvg(pm25Array) + "µg/m³" + "<br>" + retstring;
    }
    if(array[1].length != 0 ){
        retstring = "pm10: " + getAvg(pm10Array) + "ppm" + "<br>" + retstring;
    }
    if(array[2].length!= 0 ){
        retstring = "no2: " + getAvg(no2Array) + "ppm" + "<br>" + retstring;
    }
    if(array[3].length!= 0){
        retstring = "o3: " + getAvg(o3Array) + "ppm" + "<br>" + retstring;
    }
    if(array[4].length!= 0){
        retstring = "co: " + getAvg(coArray) + "ppm"  + "<br>"+ retstring;
    }
    if(array[5].length!= 0){
        retstring = "bc: " + getAvg(bcArray) + "bc"  + "<br>"+ retstring;
    }
    return retstring;
}
function getArrays(unique_marker, chemical)
{
    var pm25Array = [];
    var pm10Array =[];
    var no2Array = [];
    var o3Array = [];
    var coArray= [];
    var bcArray= [];
    for(var j =0; j< unique_marker.date_entries.length; j++)
    {
        if (unique_marker.date_entries[j].pm25 !=null && chemical ==null || chemical =="pm25")
        {
            //pm25Array = pm25Array + unique_marker.date_entries[j].pm25;
            pm25Array.push(unique_marker.date_entries[j].pm25);
        }
        if (unique_marker.date_entries[j].pm10!=null && chemical ==null || chemical =="pm10")
        {
            //pm10Array = pm10Array + unique_marker.date_entries[j].pm10;
            pm10Array.push(unique_marker.date_entries[j].pm10);
        }
        if (unique_marker.date_entries[j].no2 !=null && chemical ==null || chemical =="no2")
        {
            //no2Array = no2Array + unique_marker.date_entries[j].no2;
            no2Array.push(unique_marker.date_entries[j].no2);
        }
        if (unique_marker.date_entries[j].o3 !=null && chemical ==null || chemical =="o3")
        {
            //o3Array = o3Array + unique_marker.date_entries[j].o3;
            o3Array.push(unique_marker.date_entries[j].o3);
        }
        if (unique_marker.date_entries[j].co !=null && chemical ==null || chemical =="co")
        {
            //coArray = coArray + unique_marker.date_entries[j].co;
            coArray.push(unique_marker.date_entries[j].co);
        }
        if (unique_marker.date_entries[j].bc !=null && chemical ==null || chemical =="bc")
        {
            //bcArray = bcArray + unique_marker.date_entries[j].bc;
            bcArray.push(unique_marker.date_entries[j].bc);
        }
    }
    var all = [pm25Array,pm10Array,no2Array,o3Array,coArray,bcArray];
    return all;

}
function getAvg(value){

    ret = 0;
    for(var i = 0; i<value.length; i++){
        ret = ret + value[i];
    }
    ret = ret/value.length
    return Math.round(ret * 10000) / 10000;
}
function date_entry(){
    this.date= null;
    this.pm25 = null;
    this.pm10 = null;
    this.no2 = null;
    this.o3 = null;
    this.co = null;
    this.bc = null;
    this.setParameter = function (parameter,value){
        if(parameter == "pm25"){this.pm25=value;}
        if(parameter == "pm10"){this.pm10=value;}
        if(parameter == "no2"){this.no2=value;}
        if(parameter == "o3"){this.o3=value;}
        if(parameter == "co"){this.co=value;}
        if(parameter == "bc"){this.bc=value;}
    }
}
function unique_marker(lat, lng){
    this.visible=false;
    this.coordinates = [];
    this.coordinates.latitude = lat;
    this.coordinates.longitude = lng;
    this.marker = null;
    this.date_entries = [];
    this.addDateEntry = function(date,parameter,value){
        var new_entry = new date_entry;
        new_entry.date = date;
        new_entry.setParameter(parameter,value);
        this.date_entries.push(new_entry);
    }
}
function heatMapGradient(parameter, value)
{
    var gradient = null;
    if (parameter == "pm25")
    {
        gradient = value /250;
        //gradient = {35.4: 'green' ,  150.4:'orange', 250:'red'}
    }
    else if (parameter == "pm10")
    {
        gradient = value /424;
        //gradient = {154:'green' , 354:'orange' , 424:'red'}
    }
    else if(parameter == "co")
    {
        gradient = value /30.4;
        //gradient = {9.4:'green' , 15.4:'orange' , 30.4:'red'}
    }
    else if (parameter =="no2")
    {
        gradient = value /1249;
        //gradient = {100:'green' , 649:'orange' , 1249:'red'}
    }
    else if (parameter =="o3")
    {
        gradient = value /.200;
        //gradient = {.085:'green' , .105:'orange' , .200:'red'}
    }
    return gradient;
}
function getMapRadiusKM (map) 
{
    var mapBoundNorthEast = map.getBounds().getNorthEast();
    var mapDistance = mapBoundNorthEast.distanceTo(map.getCenter());
    return mapDistance/1000;
}

function heatMap1()
{
    setTimeout(function(){
        if (app.heat1 == true)
        {
            var array = [];
            for (var i=0; i< app.unique_markers1.length; i++)
            {
                array[i] = [app.unique_markers1[i].coordinates.latitude, app.unique_markers1[i].coordinates.longitude , heatMapGradient(getAvg(getArrays(app.unique_markers1[i],app.checkedParams1[0])),app.checkedParams1[0]) ];
            }
            var heat2 = L.heatLayer(array, {
                radius: 50, 
                gradient: {.3:'green' , .6:'orange' , 1:'red'},
                minOpacity: .5
            }).addTo(app.map1); 
        }
        else
        {
            //remove?
            //heat2.onRemove(app.map2);
        }

    },1000);
}
function heatMap2()
{
    setTimeout(function(){
        if (app.heat2 == true)
        {
            var array = [];
            for (var i=0; i< app.unique_markers2.length; i++)
            {
                array[i] = [app.unique_markers2[i].coordinates.latitude, app.unique_markers2[i].coordinates.longitude , heatMapGradient(getAvg(getArrays(app.unique_markers2[i],app.checkedParams2[0])),app.checkedParams2[0]) ];
            }
            var heat2 = L.heatLayer(array, {
                radius: 50, 
                gradient: {.3:'green' , .6:'orange' , 1:'red'},
                minOpacity: .5
            }).addTo(app.map2); 
        }
        else
        {
            //remove?
            //heat2.onRemove(app.map2);
        }

    },1000);
}
addMarker = function([lat,lng],map){
    var marker = L.marker([lat, lng]).addTo(map);
    return marker;
}
/*   Loops    */
DeleteOldMarkers = function(arr,map){
    var num_deleted=0;//for printing purposes only
    var i = arr.length
    while (i--) {
        if(!map.getBounds().contains([arr[i].coordinates.latitude,arr[i].coordinates.longitude])){ 
            map.removeLayer(arr[i].marker);
            arr.splice(i, 1);
            num_deleted++;
        } 
    }
    console.log("deleted :"+num_deleted + " markers");
    console.log("currently have :"+arr.length + " markers");
}
fullscreen1 = function(){
    document.getElementById("map2_and_nav").style.display="none";
    document.getElementsByClassName("maps")[0].style.width="100vw";
    document.getElementById("fullscreen1").style.display="none";
    document.getElementById("halfscreen1").style.display="inline";
    app.map1.invalidateSize();
    app.map2.invalidateSize();
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
showFilter1 = function(){
    document.getElementById("nav1").style.display="none";
    document.getElementById("filter-page1").style.display="inline";
}
showNav1 = function(){
    document.getElementById("filter-page1").style.display="none";
    document.getElementById("nav1").style.display="block";
}
showFilter2 = function(){
    document.getElementById("nav2").style.display="none";
    document.getElementById("filter-page2").style.display="inline";
}
showNav2 = function(){

    document.getElementById("filter-page2").style.display="none";
    document.getElementById("nav2").style.display="block";
}