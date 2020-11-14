import $ from "jquery";

const latitude = localStorage.getItem("latitude");
const longitude = localStorage.getItem("longitude");

// make ajax call to weather API and injects data with jquery to html document

if (latitude && longitude) {
    $.ajax({
        url: "https://api.weatherapi.com/v1/current.json?key=" +
            process.env.WEATHER_API_KEY +
            "&q=" +
            latitude +
            "," +
            longitude,
        type: "GET",
        dataType: "json",
        success: function(result) {
            console.log(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
}