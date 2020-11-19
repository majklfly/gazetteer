import L from "leaflet";
import $ from "jquery";
import { ajaxGet } from "./utils";

let map;

// calls API based on user's IP and returns location
export const leafletmap = async() => {
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");
    const countryCode3 = localStorage.getItem("countryCode3");
    const countryCode = localStorage.getItem("countryCode");

    if (typeof map === "undefined") {
        map = L.map("mapid");
    }
    map.setView([latitude, longitude], 5);

    L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
            maxZoom: 15,
        }
    ).addTo(map);

    $.ajax({
        url: "https://localhost/gazetteer/src/data/countries.geojson",
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log("fly result", result);
            result.features.map((country) => {
                if (country.properties.ISO_A3 === countryCode3) {
                    const feature = L.geoJSON(country).addTo(map);
                    map.flyToBounds(feature.getBounds());
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });

    try {
        const capitalRaw = await localStorage.getItem("capitalCity");
        const capital = capitalRaw.replace(" ", "");

        const capitalCity = await ajaxGet("capitalCityDetails.php", {
            capitalCity: capital,
            apiKey: CAPITAL_API_KEY,
            countryCode: countryCode,
        });
        localStorage.setItem("latitude", capitalCity.lat);
        localStorage.setItem("longitude", capitalCity.lon);
        var popup = L.popup()
            .setLatLng([latitude, longitude])
            .setContent(
                "<object id='iframePopup' data='src/html/popupContent.html' style='border:none' width='100%' height='100%'></object>"
            );

        var greenIcon = L.icon({
            iconUrl: "src/img/leaf-green.png",
            shadowUrl: "src/img/leaf-shadow.png",

            iconSize: [19, 47], // size of the icon
            shadowSize: [25, 32], // size of the shadow
            iconAnchor: [11, 47], // point of the icon which will correspond to marker's location
            shadowAnchor: [2, 31], // the same for the shadow
            popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
        });

        L.marker([capitalCity.lat, capitalCity.lon], {
                icon: greenIcon,
            })
            .addTo(map)
            .bindPopup(popup);
    } catch (e) {
        console.log("capitalCityError", e);
    }
};