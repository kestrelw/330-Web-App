import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js"
import * as parkView from "./parks-viewer.js"

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = [/*"p20","p79","p180","p43"*/];
let geojson;

let button = document.querySelector("#btn-add");
let buttonDelete = document.querySelector("#btn-delete");
let description = document.querySelector("#details-2");

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	// document.querySelector("#btn1").onclick = () => {
	// 	map.setZoomLevel(5.2);
	// 	map.setPitchAndBearing(0,0);
	// 	map.flyTo(lnglatNYS);
	// };
	// // NYS isometric view
	// document.querySelector("#btn2").onclick = () => {
	// 	map.setZoomLevel(5.5);
	// 	map.setPitchAndBearing(45,0);
	// 	map.flyTo(lnglatNYS);
	// };
	// // World zoom 0
	// document.querySelector("#btn3").onclick = () => {
	// 	map.setZoomLevel(3);
	// 	map.setPitchAndBearing(0,0);
	// 	map.flyTo(lnglatUSA);
	// };

	refreshFavorites();
}

const init = () => {
	//map.initMap(lnglatNYS);

	favoriteIds = storage.readFromLocalStorage("favoriteParkIds");
	console.log(favoriteIds);
	if(!Array.isArray(favoriteIds)){
		favoriteIds = [];
	}

	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	})

};

const getFeatureById = (id) => {
	const thing = geojson.features.find(it => it.id == id);///RENAME VARIABLES
	//console.log("id thing: "+ thing);
	return thing;
}
	
const showFeatureDetails = (id) => {
	//console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	console.log(feature);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = 
		`<p><b>Address: </b>${feature.properties.address}</p>
		<p><b>Phone: </b><a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website: </b><a href ="${feature.properties.url}">${feature.properties.url}</a></p>`;
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;

	document.querySelector(".control").style.display = "block";
	if(favoriteIds.indexOf(id) != -1){
		button.disabled = true;
		buttonDelete.disabled = false;

		buttonDelete.onclick = () => {
			const deleted = favoriteIds.splice([favoriteIds.indexOf(id)], 1);		
			storage.writeToLocalStorage("favoriteParkIds",favoriteIds);
			refreshFavorites();
			button.disabled = false;
			buttonDelete.disabled = true;
			parkView.deleteParkNameData(feature.properties.title, feature.id)
		};
	}
	else{
		button.disabled = false;
		buttonDelete.disabled = true;

		button.onclick = () => {
			console.log("button clicked");
			favoriteIds.push(id);
			storage.writeToLocalStorage("favoriteParkIds",favoriteIds);
			refreshFavorites();
			button.disabled = true;
			buttonDelete.disabled = false;
			parkView.writeParkNameData(feature.properties.title, feature.id);

		};
		  
	}

};

const refreshFavorites = () =>  {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for(const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
};

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
}




init();