import $ from "jquery";
import "bootstrap";
import { ajaxGet } from "./js/utils";

import { countriesSelection } from "./js/countriesSelection";
import { leafletmap } from "./js/leaflet";
import { retrieveWeatherData } from "./js/weather";
import { covidFetch } from "./js/covid";
import { fetchDataForGallery } from "./js/photoGallery";

console.log(GEO_API_KEY)

const Render = async() => {
    console.log("lets get started")
    // $("#loadingContainer").css("display", "block");
    // const result = await ajaxGet("currentLocation.php", { key: GEO_API_KEY });
    if (typeof result != "undefined") {
        console.log("running")
        localStorage.setItem("latitude", result.latitude);
        localStorage.setItem("longitude", result.longitude);
        localStorage.setItem("countryCode3", result.country_code3);
        localStorage.setItem("countryCode", result.country_code2);
        localStorage.setItem("countryName", result.country_name);
        document.getElementById("countryTitle").innerHTML = result.country_name;
        await countriesSelection();
        await leafletmap();
        await retrieveWeatherData();
        await covidFetch();
        await fetchDataForGallery();
        $("#loadingContainer").css("display", "none");
    } else {
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
        country: currentValue,
    });
    console.log(data);
    localStorage.setItem("countryCode3", data[0].isoAlpha3);
    localStorage.setItem("countryName", data[0].countryName);
    document.getElementById("countryTitle").innerHTML = data[0].countryName;
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
});

$("#londonButton").click(async function(e) {
    $("#londonButton").remove();
    localStorage.setItem("latitude", "51.5002");
    localStorage.setItem("longitude", "-0.126236");
    localStorage.setItem("countryCode3", "GBR");
    localStorage.setItem("countryCode", "GB");
    localStorage.setItem("countryName", "United Kingdom");
    document.getElementById("countryTitle").innerHTML = "United Kingdom";
    await countriesSelection();
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
});