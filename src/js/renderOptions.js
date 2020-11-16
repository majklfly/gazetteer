import $ from "jquery";
import { contriesSelection } from "./countriesSelection";
import { leafletmap } from "./leaflet";
import { retrieveWeatherData } from "./weather";
import { covidFetch } from "./covid";
import { fetchDataForGallery } from "./photoGallery";

// fetch data about current location and setting first render
export const firstRender = async() => {
    $("#loadingContainer").css("display", "block");
    await $.ajax({
        url: "https://api.ipgeolocation.io/ipgeo?apiKey=" + GEO_API_KEY,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
            localStorage.setItem("latitude", result.latitude);
            localStorage.setItem("longitude", result.longitude);
            const countryCode = result.country_code2;
            localStorage.setItem("countryCode3", result.country_code3);
            localStorage.setItem("countryCode", countryCode);
            localStorage.setItem("countryName", result.country_name);
            const title = localStorage.getItem("countryName");
            document.getElementById("countryTitle").innerHTML = title;
            if (title && title.length > 30) {
                $("#countryTitle").css("font-size", "1.8vw");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
};

export const updateRender = async() => {
    $("#loadingContainer").css("display", "block");
    const title = localStorage.getItem("countryName");
    document.getElementById("countryTitle").innerHTML = title;
    if (title && title.length > 30) {
        $("#countryTitle").css("font-size", "1.8vw");
    }
    await leafletmap();
    await retrieveWeatherData();
    await covidFetch();
    await fetchDataForGallery();
    $("#loadingContainer").css("display", "none");
};

//decides between first render or already search followed by sequence of calls