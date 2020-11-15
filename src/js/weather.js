import $ from "jquery";
import Config from "Config";

// make ajax call to weather API and injects data with jquery to html document

export const retrieveWeatherData = async() => {
    const latitude = await localStorage.getItem("latitude");
    const longitude = await localStorage.getItem("longitude");

    console.log("latitude", latitude);

    if (latitude && longitude) {
        $.ajax({
            url: "https://api.weatherapi.com/v1/current.json?key=" +
                Config.WEATHER_API_KEY +
                "&q=" +
                latitude +
                "," +
                longitude,
            type: "GET",
            dataType: "json",
            success: function(result) {
                $("#weatherTitle").html(result.current.condition.text);
                $("#wind").html("Wind: " + result.current.wind_kph + "km/h");
                $("#temp").html("Temp: " + result.current.temp_c + "°C");
                $("#weatherPicture")
                    .attr("src", result.current.condition.icon)
                    .css("width", "100px");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            },
        });
    }
};