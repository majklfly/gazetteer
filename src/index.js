import $ from "jquery";
import { contriesSelection } from "./js/countriesSelection";
import { fetchCurrentLocation, leafletmap } from "./js/leaflet";
import "./js/weather";

const title = localStorage.getItem("countryName");

document.getElementById("countryTitle").innerHTML = title;

if (title && title.length > 30) {
    $("#countryTitle").css("font-size", "1.8vw");
}

const latitude = localStorage.getItem("latitude");

if (!latitude) {
    fetchCurrentLocation();
} else {
    leafletmap();
}