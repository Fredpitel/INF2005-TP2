var aeroports = [
	{ville: "Vancouver", l: 160, t: 440}, 
	{ville: "Calgary", l: 380, t: 430}, 
	{ville: "Regina", l: 530, t: 470}, 
	{ville: "Winnipeg", l: 665, t: 500}, 
	{ville: "Toronto", l: 1105, t: 610}, 
	{ville: "Montréal", l: 1230, t: 510}
];

var aeroportsTries = [
	{ville: "Calgary", index: 1},
	{ville: "Montréal", index: 5},
	{ville: "Regina", index: 2},
	{ville: "Toronto", index: 4},
	{ville: "Vancouver", index: 0},
	{ville: "Winnipeg", index: 3}
];

var depart = null;
var arrivee = null;
var escalesDisponibles = [];
var escalesChoisies = [];

var rotation = false;
var interval;

document.addEventListener("DOMContentLoaded", function () {
	initialiserBoutons();
	initialiserCheckbox();
});

function initialiserBoutons() {
	var boutondDecollage = document.getElementById("decollage");
	var boutonRecommencer = document.getElementById("recommencer");

	boutonRecommencer.addEventListener("click", function() {
		recommencer();
		enleverItineraire();
	});

	boutondDecollage.addEventListener("click", function() {
		animerVol();
	});
}

function initialiserCheckbox() {
	var listeCheckbox = document.getElementsByClassName("checkbox");

	for(var i = 0; i < listeCheckbox.length; i++){
		listeCheckbox[i].removeEventListener("click", click, false);
		listeCheckbox[i].addEventListener("click", click, false);

		var index = listeCheckbox[i].getAttribute("index");
		
		if(depart != null && index === depart) {
			listeCheckbox[i].checked = true;
		} else if(arrivee != null && index === arrivee) {
			listeCheckbox[i].checked = true;
		} else if(escalesChoisies.length > 0) {
			for(var j = 0; j < escalesChoisies.length; j++) {
				if(escalesChoisies[j] === index){
					listeCheckbox[i].checked = true;
				}
			}
		}
	}
}

function click() {
	notify(this);
}

function notify(checkbox){
	var index = checkbox.getAttribute("index");

	enleverItineraire();
	if(checkbox.checked){
		if(depart === null){
			depart = index;
		} else if(arrivee === null) {
			arrivee = index;
		} else { 
			escalesChoisies.push(index);
			if(depart < arrivee) {
				escalesChoisies.sort();				
			} else {
				escalesChoisies.sort(function(a, b){return b-a});
			}

		}
	} else {
		if(depart === index){
			recommencer();
		} else if(arrivee === index){
			arrivee = null;
			escalesDisponibles = [];
			escalesChoisies = [];
		} else {
			escalesChoisies.splice(escalesChoisies.indexOf(index), 1);
		}
	}

	mettreVueAJour();
}

function recommencer(){
	depart = null;
	arrivee = null;
	clearInterval(interval);
	escalesDisponibles = [];
	escalesChoisies = [];
	mettreVueAJour();
}

function mettreVueAJour() {
	mettreDepartAJour();
	mettreArriveeAJour();
	mettreEscalesAJour();
	mettreEtiquettesAJour();
	initialiserCheckbox();
}

function mettreDepartAJour() {
	var listeDepart = document.getElementById("depart");
	
	listeDepart.innerHTML = "";

	if(depart === null){
		for(var i = 0; i < aeroportsTries.length; i++){
			listeDepart.innerHTML += "<li><a href=\"#\"><span>" + aeroportsTries[i].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + aeroportsTries[i].index + "\"/></span></a></li>";
		}
	} else {
		listeDepart.innerHTML = "<li><a href=\"#\"><span>" + aeroports[depart].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + depart + "\"/></span></a></li>";
	}
}

function mettreArriveeAJour() {
	var listeArrivee = document.getElementById("arrivee");
	
	listeArrivee.innerHTML = "";
	
	if(depart === null) {
		listeArrivee.innerHTML = "<li><a href=\"#\"><span>Veuillez choisir une ville de départ</span></a></li>"
	} else if(arrivee === null) {
		for(var i = 0; i < aeroportsTries.length; i++){
			if(aeroportsTries[i].index != depart){
				listeArrivee.innerHTML += "<li><a href=\"#\"><span>" + aeroportsTries[i].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + aeroportsTries[i].index + "\"/></span></a></li>";
			}
		}
	} else {
		listeArrivee.innerHTML = "<li><a href=\"#\"><span>" + aeroports[arrivee].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + arrivee + "\"/></span></a></li>";
	}
}

function mettreEscalesAJour() {
	var listeEscale = document.getElementById("escale");
	
	listeEscale.innerHTML = "";

	if(depart === null) {
		listeEscale.innerHTML = "<li><a href=\"#\"><span>Veuillez choisir une ville de départ</span></a></li>"
	} else if(arrivee === null) {
		listeEscale.innerHTML = "<li><a href=\"#\"><span>Veuillez choisir une ville d'arrivée</span></a></li>"
	} else {
	 	if(escalesChoisies.length === 0){
			obtenirListeEscales();	
		}

		if(escalesDisponibles.length === 0) {
			listeEscale.innerHTML = "<li><a href=\"#\"><span>Aucune escale disponible pour ce vol</span></a></li>";
		} else if(escalesChoisies.length === 3) {
			for(var i = 0; i < escalesChoisies.length; i++) {
				var index = escalesChoisies[i];
		 		listeEscale.innerHTML += "<li><a href=\"#\"><span>" + aeroports[index].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + index + "\"/></span></a></li>";
		 	}
		} else {
			for(var i = 0; i < escalesDisponibles.length; i++) {
				for(var j = 0; j < aeroportsTries.length; j++) {
					if(escalesDisponibles[i] === aeroportsTries[j].index){
						listeEscale.innerHTML += "<li><a href=\"#\"><span>" + aeroportsTries[j].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + aeroportsTries[j].index + "\"/></span></a></li>";
					}
				}
			}
		}
	}
}

function obtenirListeEscales() {
	var debut = Math.min(parseInt(depart), parseInt(arrivee));
	var fin = Math.max(parseInt(depart), parseInt(arrivee));

	escalesDisponibles = [];

	for(var i = debut + 1; i < fin; i++) {
		escalesDisponibles.push(i);
	}
}

function mettreEtiquettesAJour() {
	var tagArrivee = document.getElementById("villeDArrivee");
	var tagDepart = document.getElementById("villeDeDepart");
	var tagsEscale = document.getElementsByClassName("escale");

	if(depart != null) {
		tagDepart.innerHTML = aeroports[depart].ville;
	} else {
		tagDepart.innerHTML = "";
	}

	if(arrivee != null) {
		tagArrivee.innerHTML = aeroports[arrivee].ville;
	} else {
		tagArrivee.innerHTML = "";
	}

	for(var i = 0; i < tagsEscale.length; i++){
		tagsEscale[i].innerHTML = "";
		if(escalesChoisies[i] != null) {
			tagsEscale[i].innerHTML = aeroports[escalesChoisies[i]].ville;
		}
	}
}

function animerVol(){
	if(depart != null && arrivee != null){
		var avion = document.getElementById("avion");

		if(depart > arrivee && !rotation) {
			avion.style.transform = "rotate(" + 180 + "deg)";
			rotation = true;
		} else if( depart < arrivee && rotation){
			avion.style.transform = "none";
			rotation = false;
		}

		avion.style.left = aeroports[depart].l + "px";
		avion.style.top = aeroports[depart].t + "px";
		avion.style.display = "block";

		dessinerItineraire();
		var itineraire = [depart];
		for(var i = 0; i < escalesChoisies.length; i++) {
			itineraire.push(escalesChoisies[i]);
		}
		itineraire.push(arrivee);

		animerAvion(itineraire);
	}
}

function dessinerItineraire() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	context.beginPath();
	context.strokeStyle= "red";
	context.lineWidth = 10;
	context.moveTo(aeroports[depart].l + 45, aeroports[depart].t + 45);
	for(var i = 0; i < escalesChoisies.length; i++){
		context.lineTo(aeroports[escalesChoisies[i]].l + 45, aeroports[escalesChoisies[i]].t + 45);
	}
	context.lineTo(aeroports[arrivee].l + 45, aeroports[arrivee].t + 45);
	context.stroke();
}

function enleverItineraire(){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var avion = document.getElementById("avion");

	context.clearRect(0, 0, canvas.width, canvas.height);
	avion.style.display = "none";
}

function animerAvion(itineraire) {
	var i = 0;
	var param = paramDeVol(itineraire[i], itineraire[i + 1]);
	var posX = aeroports[itineraire[i]].l;
	var posY = aeroports[itineraire[i]].t;

	interval = setInterval(frame, 10);

	function frame() {
	    if (i === itineraire.length - 1) {
	        clearInterval(interval);
	    } else if(param.distanceHor < 0) {
	    	i++;
	    	if(i < itineraire.length - 1) {
		    	param = paramDeVol(itineraire[i], itineraire[i + 1]);
				posX = aeroports[itineraire[i]].l;
				posY = aeroports[itineraire[i]].t;
			}
	    } else {
	    	posX += param.deltaHor;
	    	param.distanceHor--;
			posY += param.deltaVer;
	    }
	    avion.style.left = posX + "px";
		avion.style.top = posY + "px";
	}
}

function paramDeVol(pointDep, pointArr) {
	var distanceHor = Math.abs(aeroports[pointArr].l - aeroports[pointDep].l);
	var distanceVer = aeroports[pointArr].t - aeroports[pointDep].t;
	var deltaVer = (1 / distanceHor) * distanceVer;
	var deltaHor = 1;

	if(aeroports[pointDep].l > aeroports[pointArr].l){
		deltaHor = -1;
	}

	var param = {
		deltaHor: deltaHor,
		deltaVer: deltaVer,
		distanceHor: distanceHor
	}

	return param;
}