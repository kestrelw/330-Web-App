import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = ["p20","p79","p180","p43"];
let geojson;

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lngLatNYS);
	};
	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lngLatNYS);
	};
	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lngLatUSA);
	};

	refreshFavorites();
}

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	})
};

const getFeatureById = (id) => {
	const thing = geojson.features.find(it => it.id == id);///RENAME VARIABLES
	console.log("id thing: "+ thing);
	return thing;
}
	
const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	console.log(feature);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	// document.querySelector("#details-2").innerHTML = 
	// `<b>Address: </b>${feature.properties.address}
	// <b>Phone: </b><a href="tel:${feature.properties.phone}">${feature.properties.phone}</a>
	// <b>Website: </b><a href ="${feature.properties.url}">${feature.properties.url}</a>`;
	document.querySelector("#details-2").innerHTML = 
		`<p><b>Address: </b>${feature.properties.address}</p>
		<p><b>Phone: </b><a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website: </b><a href ="${feature.properties.url}">${feature.properties.url}</a></p>`;
	//'words words \n words';//ITS NOT WORKINGGG
	
	// "<b>Address: </b>"+ feature.properties.address
	// 												+ "\n<b>Phone: </b><a href=tel:"+feature.properties.phone+">"+feature.properties.phone+"</a>"
	// 												+ "\n<b>Website: </b><a href ="+feature.properties.url+">"+feature.properties.url+"</a>";;
	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;
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