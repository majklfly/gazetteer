var $ = require("jquery");

// makes ajax call with string countryCode and recieves data about the country
const currentCountryCode = localStorage.getItem("countryCode");

const getCountryDetails = (countryCode) => {
    $.ajax({
        url: "https://restcountries.eu/rest/v2/alpha/" + currentCountryCode,
        type: "GET",
        dataType: "json",
        data: {
            country: currentCountryCode,
        },
        success: function(result) {
            console.log(result);

            if (result) {
                $("#continent").html(result.region);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error", errorThrown);
        },
    });
};

getCountryDetails("GB");