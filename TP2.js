var aeroports = [
	{ville: "Calgary", l: 375, t: 380}, 
	{ville: "Montréal", l: 1230, t: 510},
	{ville: "Regina", l: 540, t: 420}, 
	{ville: "Toronto", l: 1105, t: 610}, 
	{ville: "Vancouver", l: 160, t: 440}, 
	{ville: "Winnipeg", l: 665, t: 500}
];

var depart = null;
var arrivee = null;
var escalesDisponibles = [];
var escalesChoisies = [];

var horlogeHeures = 0;
var horlogeMinutes = 0;
var horloge

var rotation = false;
var interval;
var vol = false;

document.addEventListener("DOMContentLoaded", function () {
	initialiserBoutons();
	initialiserCheckbox();
	initialiserOptions();
	initialiserHeure();
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

function initialiserOptions() {
	var optionInfoVol = document.getElementById("optionInfoVol");
	var optionEquipage = document.getElementById("optionEquipage");
	var boxInfoVol = document.getElementById("boxInfoVol");

	optionInfoVol.addEventListener("click", function() {
		if(optionInfoVol.checked && vol === true) {
			boxInfoVol.style.display = "inherit";
		} else {
			boxInfoVol.style.display = "none";
		}
	});

	//TODO optionEquipage
}

function initialiserHeure() {
	horlogeHeure = 0;
	horlogeMinute = 0;
	horloge = setInterval(avancerHeure, 400);
}

function avancerHeure() {
	horlogeMinutes += 5;
	if (horlogeMinutes >= 60) {
		horlogeMinutes = 0;
		horlogeHeures ++;
		if (horlogeHeures > 23) {
			horlogeHeures = 0;
		}
	}
	var monHorloge = document.getElementById("horloge");
	monHorloge.innerHTML = formaterHeure(horlogeHeures, horlogeMinutes);

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
			if(aeroports[depart].l < aeroports[arrivee].l) {
				escalesChoisies.sort(function(a, b){return aeroports[a].l-aeroports[b].l});				
			} else {
				escalesChoisies.sort(function(a, b){return aeroports[b].l-aeroports[a].l});
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
	vol = false;
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
		for(var i = 0; i < aeroports.length; i++){
			listeDepart.innerHTML += "<li><a href=\"#\"><span>" + aeroports[i].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + i + "\"/></span></a></li>";
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
		for(var i = 0; i < aeroports.length; i++){
			if(i != depart){
				listeArrivee.innerHTML += "<li><a href=\"#\"><span>" + aeroports[i].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + i + "\"/></span></a></li>";
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
				for(var j = 0; j < aeroports.length; j++) {
					if(escalesDisponibles[i] === j){
						listeEscale.innerHTML += "<li><a href=\"#\"><span>" + aeroports[j].ville + "<input type=\"checkbox\" class=\"checkbox\" index=\"" + j + "\"/></span></a></li>";
					}
				}
			}
		}
	}
}

function obtenirListeEscales() {
	var debut = Math.min(aeroports[depart].l, aeroports[arrivee].l);
	var fin = Math.max(aeroports[depart].l, aeroports[arrivee].l);

	for(var i = 0; i < aeroports.length; i++) {
		if(aeroports[i].l < fin && aeroports[i].l > debut) {
			escalesDisponibles.push(i);
		}
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
	var avion = document.getElementById("avion");
	avion.style.display = "none";
	clearInterval(interval);

	if(depart != null && arrivee != null){
		vol = true;
		var boxInfoVol = document.getElementById("boxInfoVol");
		var optionInfoVol = document.getElementById("optionInfoVol");

		if(aeroports[depart].l > aeroports[arrivee].l && !rotation) {
			avion.style.transform = "rotate(" + 180 + "deg)";
			rotation = true;
		} else if(aeroports[depart].l < aeroports[arrivee].l && rotation){
			avion.style.transform = "none";
			rotation = false;
		}

		avion.style.left = aeroports[depart].l + "px";
		avion.style.top = aeroports[depart].t + "px";
		avion.style.display = "block";
		if(optionInfoVol.checked) {
			boxInfoVol.style.display = "block";
		}
		
		boxInfoVol.style.left = aeroports[depart].l + "px";
		boxInfoVol.style.top = aeroports[depart].t - 60 + "px";

		dessinerItineraire();
		var itineraire = [depart];
		for(var i = 0; i < escalesChoisies.length; i++) {
			itineraire.push(escalesChoisies[i]);
		}
		itineraire.push(arrivee);

		animerAvion(itineraire);
	} else {
		alert("Veuillez choisir une ville de départ et une ville d'arrivée.")
	}
}

function dessinerItineraire() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	
	var infoDepart = document.getElementById("infoDepart");
	infoDepart.innerHTML= aeroports[depart].ville;
	
	var infoArrivee = document.getElementById("infoArrivee");
	infoArrivee.innerHTML = aeroports[arrivee].ville;
	

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
	var boxInfoVol = document.getElementById("boxInfoVol");
	
	var infoDepart = document.getElementById("infoDepart");
	infoDepart.innerHTML= " - ";
	
	var infoArrivee = document.getElementById("infoArrivee");
	infoArrivee.innerHTML = " - ";
	
	var infoProchaineVille = document.getElementById("infoProchaineVille");
	infoProchaineVille.innerHTML = " - "

	context.clearRect(0, 0, canvas.width, canvas.height);
	avion.style.display = "none";
	boxInfoVol.style.display = "none";
}

function animerAvion(itineraire) {
	var i = 0;
	var param = paramDeVol(itineraire[i], itineraire[i + 1]);
	var posX = aeroports[itineraire[i]].l;
	var posY = aeroports[itineraire[i]].t;
	
	var infoProchaineVille = document.getElementById("infoProchaineVille");
	infoProchaineVille.innerHTML = aeroports[itineraire[i+1]].ville;
	
	var tempsRestant = Math.abs(aeroports[depart].l - aeroports[arrivee].l) -1;
	var vitesse = 0;

	interval = setInterval(frame, 20);

	function frame() {
	    if (i === itineraire.length - 1) {
	        clearInterval(interval);
	    } else if(param.distanceHor <= 0) {
	    	i++;
	    	if(i < itineraire.length - 1) {
		    	param = paramDeVol(itineraire[i], itineraire[i + 1]);
				infoProchaineVille.innerHTML = aeroports[itineraire[i+1]].ville;
			}
	    } else {
	    	posX += param.deltaHor;
			posY += param.deltaVer;
			param.distanceHor--;

			calculerTempsRestantBoxInfoVol();
			calculerVitesse();
			
			avion.style.left = posX + "px";
			avion.style.top = posY + "px";
			
			boxInfoVol.style.left = posX + "px";
			boxInfoVol.style.top = posY - 45 + "px"; 
		}
	}
	
	function calculerTempsRestantBoxInfoVol() {
		if (tempsRestant % 20 === 0) {
			var infoTempsRestant = document.getElementById("infoTempsRestant");
			var minutes = tempsRestant / 20 * 5;
			var heures = (minutes / 60) >> 0;
			minutes = minutes % 60;
			
			infoTempsRestant.innerHTML = formaterHeure(heures, minutes);;
		}
		tempsRestant--;
		
	}
	
	function calculerVitesse() {
		var infoVitesse = document.getElementById("infoVitesse");
		
		if (param.distanceHor < 14) {
			vitesse -= 60;
			if (vitesse < 0 ) {
				vitesse = 0;
			}
		}
		else {
			if (vitesse < 825) {
				vitesse += 60;
			}
			
			if(vitesse > 830) {
				vitesse = 827;
			}
			
			if (tempsRestant % 100 === 33){
				vitesse += 1;
			}
			else if (tempsRestant % 100 === 66) {
				vitesse -= 2;
			}
			else if (tempsRestant % 100 === 99) {
				vitesse += 2;
			}
		}
		
		infoVitesse.innerHTML = vitesse + " km/h";
	}
}

function formaterHeure(heures, minutes) {
	var strTemps = "";
			
	if (heures < 10){
		strTemps = strTemps.concat("0" + heures + "h");
	}
	else {
		strTemps = strTemps.concat(heures + "h");
	}
	
	if (minutes < 10) {
		strTemps = strTemps.concat("0" + minutes);
	}
	else {
		strTemps = strTemps.concat(minutes);
	}
	return strTemps;
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