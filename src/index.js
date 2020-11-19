import $ from "jquery";
import "bootstrap";
import { ajaxGet } from "./js/utils";

import { countriesSelection } from "./js/countriesSelection";
import { leafletmap } from "./js/leaflet";
import { retrieveWeatherData } from "./js/weather";
import { covidFetch } from "./js/covid";
import { fetchDataForGallery } from "./js/photoGallery";

const Render = async() => {
    $("#loadingContainer").css("display", "block");
    try {
        // const result = await ajaxGet("currentLocation.php", { key: GEO_API_KEY });
        localStorage.setItem("latitude", result.latitude);
        localStorage.setItem("longitude", result.longitude);
        localStorage.setItem("countryCode3", result.country_code3);
        localStorage.setItem("countryCode", result.country_code2);
        localStorage.setItem("countryName", result.country_name);
        localStorage.setItem("capitalCity", result.country_capital);
        document.getElementById("countryTitle").innerHTML = result.country_name;
        await countriesSelection();
        await leafletmap();
        await retrieveWeatherData();
        await covidFetch();
        await fetchDataForGallery();
        $("#loadingContainer").css("display", "none");
    } catch (e) {
        $("#errorMessage").html(
            "Can't find your location. Do you want me to get you to the best city in the world?"
        );
        $("#errorMessage").append(
            " <button type='button' id='londonButton' class='btn btn-primary btn-lg'>Let's do it.</button>"
        );
    }
};
Render();

//update localstorage based on recieved data
$("#searchInput").on("change", async function(e) {
    $("#loadingContainer").css("display", "block");
    const currentValue = $("#searchInput").val();
    localStorage.setItem("countryCode", currentValue);
    const data = await ajaxGet("getCountryDetails.php", {
        countryCode: currentValue,
    });
    console.log("countryDataSearch", data);
    localStorage.setItem("capitalCity", data.capital);
    localStorage.setItem("countryCode3", data.alpha3Code);
    localStorage.setItem("countryName", data.name);
    document.getElementById("countryTitle").innerHTML = data.demonym;
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
});

$("#londonButton").click(async function(e) {
    $("#londonButton").remove();
    $("#errorMessage").remove();
    localStorage.setItem("latitude", "51.5002");
    localStorage.setItem("longitude", "-0.126236");
    localStorage.setItem("countryCode3", "GBR");
    localStorage.setItem("countryCode", "GB");
    localStorage.setItem("countryName", "United Kingdom");
    localStorage.setItem("capitalCity", "London");
    document.getElementById("countryTitle").innerHTML = "United Kingdom";
    await countriesSelection();
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
});