import $ from "jquery";
import { contriesSelection } from "./js/countriesSelection";
import { firstRender, leafletmap } from "./js/leaflet";
import { retrieveWeatherData } from "./js/weather";
import { covidFetch } from "./js/covid";
import { fetchDataForGallery } from "./js/photoGallery";

const latitude = localStorage.getItem("latitude");

//decides between first render or already search followed by sequence of calls
if (!latitude) {
    firstRender();
} else {
    const title = localStorage.getItem("countryName");
    document.getElementById("countryTitle").innerHTML = title;
    if (title && title.length > 30) {
        $("#countryTitle").css("font-size", "1.8vw");
    }
    leafletmap();
    retrieveWeatherData();
    covidFetch();
    fetchDataForGallery();
}