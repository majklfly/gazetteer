import L from "leaflet";
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

    try {
        const result = await ajaxGet("countryPolygon.php");

        console.log("countryPolygon", result);

        if (result) {
            result.map((country) => {
                if (country.properties.ISO_A3 === countryCode3) {
                    const feature = L.geoJSON(country).addTo(map);
                    map.flyToBounds(feature.getBounds());
                }
            });
        }
    } catch (e) {
        console.log("CountryPolygonError", e);
    }

    try {
        const capitalCity = await ajaxGet("capitalCityDetails.php", {
            countryCode,
        });
    } catch (e) {
        console.log("capitalCityError", e);
    }

    localStorage.setItem("latitude", capitalCity.latitude);
    localStorage.setItem("longitude", capitalCity.longitude);

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

    L.marker([capitalCity.latitude, capitalCity.longitude], { icon: greenIcon })
        .addTo(map)
        .bindPopup(popup);
};