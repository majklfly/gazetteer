import "./css/style.css";
import { fetchCurrentLocation, leafletmap } from "./js/leaflet";
import { countriesSelection } from "./js/countriesSelection";

const title = localStorage.getItem("countryName");
document.getElementById("countryTitle").innerHTML = title;

const latitude = localStorage.getItem("latitude");

if (!latitude) {
    fetchCurrentLocation();
}
leafletmap();