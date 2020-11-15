import L from "leaflet";
import $ from "jquery";
import { retrieveWeatherData } from "./weather";
import { covidFetch } from "./covid";

let latitude;
let longitude;
export let loading;

loading
    ?
    $("#loadingAnimation").css("visibility", "visible") :
    $("#loadingAnimation").css("visibility", "hidden");

// fetch data about current location
export const fetchCurrentLocation = () => {
    loading = true;
    $.ajax({
        url: "https://api.ipgeolocation.io/ipgeo?apiKey=" + process.env.GEO_API_KEY,
        type: "GET",
        dataType: "json",
        success: function(result) {
            localStorage.setItem("latitude", result.latitude);
            localStorage.setItem("longitude", result.longitude);
            const countryCode = result.country_code2;
            localStorage.setItem("countryCode", countryCode);
            localStorage.setItem("countryName", result.country_name);
            const title = localStorage.getItem("countryName");
            document.getElementById("countryTitle").innerHTML = title;
            if (title && title.length > 30) {
                $("#countryTitle").css("font-size", "1.8vw");
            }
            leafletmap();
            retrieveWeatherData();
            covidFetch();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};

// calls API based on user's IP and returns location
export const leafletmap = () => {
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    var map = L.map("mapid").setView([latitude, longitude], 5);
    L.tileLayer(
        "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}", {
            subdomains: "abcd",
            minZoom: 1,
            maxZoom: 16,
            ext: "jpg",
        }
    ).addTo(map);

    var popup = L.popup()
        .setLatLng([latitude, longitude])
        .setContent(
            "<object id='iframePopup' data='src/html/popupContent.html' style='border:none' width='100%' height='100%'></object>"
        );

    var greenIcon = L.icon({
        iconUrl: "src/img/leaf-green.png",
        shadowUrl: "src/img/leaf-shadow.png",

        iconSize: [38, 95], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    L.marker([latitude, longitude], { icon: greenIcon })
        .addTo(map)
        .bindPopup(popup);

    loading = false;
};