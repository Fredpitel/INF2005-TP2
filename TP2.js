var aeroports = ["Vancouver", "Calgary", "Regina", "Winnipeg", "Toronto", "Montréal"];

document.addEventListener("DOMContentLoaded", function () {
	var listeCheckboxDepart = document.getElementsByClassName("checkboxDepart");
	var listeDepart = document.getElementsByClassName("depart");
	var listeArrivee = document.getElementsByClassName("arrivee");

	for(var i = 0; i < listeCheckboxDepart.length; i++){
		listeCheckboxDepart[i].addEventListener("click", function(){
			var display;
			if(this.checked){
				display="none";
			} else {
				display="inherit";
			}
			manipulerListe(listeDepart, display, this);
			ajouterArrivee(this);
		});
	}
});


function manipulerListe(liste, affichage, exception){
	if(exception === null){
		for(var i = 0; i < liste.length; i++){
			liste[i].style.display = affichage;
		}
	} else {
		for(var i = 0; i < liste.length; i++){
			if(liste[i].getAttribute("index") != exception.getAttribute("index")){
				liste[i].style.display = affichage;
			}
		}
	}
}

function ajouterArrivee(checkbox) {
	var listeArrivee = document.getElementById("arrivee");

	listeArrivee.innerHTML = "";

	for(var i = 0; i < aeroports.length; i++){
		if(i != checkbox.getAttribute("index")){
			listeArrivee.innerHTML += "<li class=\"arrivee\" index=\"" + i + "\"><a href=\"#\"><span>" + aeroports[i] + "<input type=\"checkbox\" class=\"checkbox\"/></span></a></li>";
		}
	}
}