import $ from "jquery";
import { leafletmap, loading } from "./leaflet";

// fetch data from countries api and append the code and name to the select option
export const countriesSelection = $.ajax({
    url: "https://restcountries.eu/rest/v2/all",
    type: "GET",
    dataType: "json",
    success: function(result) {
        result.map((item) => {
            $("#countries").append(
                `<option value=${item.alpha2Code}>${item.name}</option>`
            );
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    },
});

// updated localstorage based on new fetch
$("#searchInput").on("keypress", function(e) {
    const currentValue = $("#searchInput").val();
    console.log("implementedValue", currentValue);
    const countryCode = localStorage.setItem("countryCode", currentValue);
    if (e.which == 13) {
        $.ajax({
            url: `https://restcountries.eu/rest/v2/alpha/${currentValue}`,
            type: "GET",
            dataType: "json",
            success: function(result) {
                console.log(result);
                localStorage.setItem("countryName", result.name);
                localStorage.setItem("latitude", result.latlng[0]);
                localStorage.setItem("longitude", result.latlng[1]);
                window.location.reload();
                leafletmap();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            },
        });
    }
});