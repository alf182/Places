//****************************************************************************************
//definicion de constantes
//****************************************************************************************
var map;
var markers = [];
var initial_position = {lat: -16.495437, lng: -68.1371807};
var current_position = initial_position;
var current_zoom = 15;

//****************************************************************************************
//Validacion de georeferenciacion del navegador
//****************************************************************************************
if ("geolocation" in navigator) {
 	// console.log("posicion habilitada");
 	navigator.geolocation.getCurrentPosition(success, error);
} else {
	console.log("navegador no soportado");
}

function success(position){
    initial_position = {lat: position.coords.latitude, lng: position.coords.longitude};
    initMap();
}

function error(){
	console.log("no se puede obtener la posicion");
	initMap();
}
//****************************************************************************************
//Inicializacion del mapa
//****************************************************************************************
function initMap() {
  	map = new google.maps.Map(document.getElementById('map'), {
	    center: initial_position,
	    zoom: current_zoom
  	});

  	var marker = new google.maps.Marker({
	    position: initial_position,
	    map: map,
	    draggable: true,
    	animation: google.maps.Animation.DROP,
	    title: 'Estas Aquí',
	    icon: '../static/img/blue.png'
	});

	google.maps.event.addListener(marker, 'dragend', function (evt) {
    	current_position = {lat: evt.latLng.lat(), lng: evt.latLng.lng()};
	});
}


//****************************************************************************************
//Llamadas a servicios de nuestro servidor
//****************************************************************************************
$(".search").keypress(function(e) {
    if(e.which == 13) {
        callSearch(this.value);
    }
});

function callSearch(toSearch){
	var params = "location="+current_position.lat+","+current_position.lng;
	if(toSearch != ''){
		params = params + "&name="+toSearch;
		//Llamada al servicio
		$.get("search/?"+params,function(data){
			if(data.status === 'INVALID_REQUEST'){
				//Sin resultados
				return false;
			}
			if(data.status === 'ZERO_RESULTS'){
				console.log("Sin resultados");
				return false;
			}
			deleteMarkers();
			$("#results").empty();
			drawCards(data.results);
			markers = [];
			drawMarkers(data.results);
		});
	}
}

function drawMarkers(data){
	for (var i = 0; i < data.length; i++) {
		var businessMarker = new google.maps.Marker({
			    position: {lat: data[i].geometry.location.lat, lng: data[i].geometry.location.lng},
			    title: data[i].name,
			    icon: '../static/img/red.png'
			});
			markers.push(businessMarker);
		}
	setMapOnAll(map);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
	setMapOnAll(null);
}

function deleteMarkers() {
	clearMarkers();
	markers = [];
}

function drawCards(data){
	for (var i = 0; i < data.length; i++) {
		$("#results").append(card(data[i]));
	}
}

function card(data){
	var abierto;
	if(typeof data.opening_hours === 'undefined'){
		abierto = "";
	}else{
		if(data.opening_hours.open_now)
			abierto="ABIERTO";
		else
			abierto="CERRADO";
	}
	
	return '<div class="app-card-wide mdl-card mdl-shadow--2dp">'+
				'<div class="mdl-card__title">'+
        		'<h2 class="mdl-card__title-text">'+data.name+'</h2>'+
				'</div>'+
      			'<div class="mdl-card__supporting-text">'+data.vicinity+'</div>'+
      			'<div class="mdl-card__actions open">'+
    			'<span class="open">'+abierto+'</span>'+
  				'</div>'+
    			'</div>';
}
