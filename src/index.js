import $ from "jquery";
import { ajaxGet } from "./js/utils";

import { countriesSelection } from "./js/countriesSelection";
import { leafletmap } from "./js/leaflet";
import { retrieveWeatherData } from "./js/weather";
import { covidFetch } from "./js/covid";
import { fetchDataForGallery } from "./js/photoGallery";

const Render = async() => {
    $("#loadingContainer").css("display", "block");
    const latitude = localStorage.getItem("latitude");
    if (!latitude) {
        const result = await ajaxGet("currentLocation.php", { key: GEO_API_KEY });
        localStorage.setItem("latitude", result.latitude);
        localStorage.setItem("longitude", result.longitude);
        localStorage.setItem("countryCode3", result.country_code3);
        localStorage.setItem("countryCode", result.country_code2);
        localStorage.setItem("countryName", result.country_name);
        document.getElementById("countryTitle").innerHTML = result.country_name;
    }
    await countriesSelection();
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
};

Render();

//update localstorage based on recieved data
$("#searchInput").on("change", async function(e) {
    $("#loadingContainer").css("display", "block");
    const currentValue = $("#searchInput").val();
    localStorage.setItem("countryCode", currentValue);
    const data = await ajaxGet("getCountryDetails.php", {
        country: currentValue,
    });
    localStorage.setItem("countryCode3", data[0].isoAlpha3);
    localStorage.setItem("countryName", data[0].countryName);
    localStorage.setItem("latitude", data[0].south);
    localStorage.setItem("longitude", data[0].west);
    await leafletmap();
    $("#loadingContainer").css("display", "none");
});