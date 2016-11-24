var aeroports = ["Vancouver", "Calgary", "Regina", "Winnipeg", "Toronto", "Montréal"];
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

document.addEventListener("DOMContentLoaded", function () {
	initialiserCheckbox();
});

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
			depart = null;
			arrivee = null;
			escalesDisponibles = [];
			escalesChoisies = [];
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
		listeDepart.innerHTML = "<li><a href=\"#\"><span>" + aeroports[depart] + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + depart + "\"/></span></a></li>";
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
		listeArrivee.innerHTML = "<li><a href=\"#\"><span>" + aeroports[arrivee] + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + arrivee + "\"/></span></a></li>";
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
		 		listeEscale.innerHTML += "<li><a href=\"#\"><span>" + aeroports[index]+ "<input type=\"checkbox\" class=\"checkbox\" index=\"" + index + "\"/></span></a></li>";
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
		tagDepart.innerHTML = aeroports[depart];
	} else {
		tagDepart.innerHTML = "";
	}

	if(arrivee != null) {
		tagArrivee.innerHTML = aeroports[arrivee];
	} else {
		tagArrivee.innerHTML = "";
	}

	for(var i = 0; i < tagsEscale.length; i++){
		tagsEscale[i].innerHTML = "";
		if(escalesChoisies[i] != null) {
			tagsEscale[i].innerHTML = aeroports[escalesChoisies[i]];
		}
	}
}