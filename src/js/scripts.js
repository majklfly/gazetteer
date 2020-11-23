// global values used across the application
let latitude;
let longitude;
let countryCode3;
let countryCode2;
let countryName;
let capitalCity;
let map;
let border;

// gets the capital city of the country and adds a marker on the map
const getCapitalCity = () => {
    $.ajax({
        url: "src/php/capitalCityDetails.php",
        type: "GET",
        dataType: "json",
        data: {
            capitalCity: capitalCity,
            countryCode: countryCode2,
            apiKey: "1856257054eb4dd4a53ffbdc7327374d",
        },
        success: function(result) {
            var popup = L.popup()
                .setLatLng([result.data.lat, result.data.lon])
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

            L.marker([result.data.lat, result.data.lon], {
                    icon: greenIcon,
                })
                .addTo(map)
                .bindPopup(popup);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};

//fetch and render weather data
const getWeatherData = () => {
    $.ajax({
        url: "https://api.weatherapi.com/v1/current.json?key=7eba887a3d9f432a888164439201411" +
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
};

// renders the polygon of the country
const countryPolygon = () => {
    $.ajax({
        url: "src/php/countryPolygon.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode3: countryCode3,
        },
        success: function(result) {
            if (map.hasLayer(border)) {
                map.removeLayer(border);
            }

            border = L.geoJson(result.data, {
                color: "#ff7800",
                weight: 2,
                opacity: 0.65,
            }).addTo(map);

            map.flyToBounds(border.getBounds());
            $("#loadingContainer").css("display", "none");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
        },
    });
};

// renders the leaflet map
const renderMap = () => {
    map = L.map("mapid").setView([latitude, longitude], 6);

    L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
            maxZoom: 15,
        }
    ).addTo(map);
};

//fetch data for the gallery and renders it
const photoGallery = () => {
    var unsplash = new UnsplashPhoto();

    const result = unsplash.all().of([capitalCity]).fetch();
    const result2 = unsplash.all().of([capitalCity]).fetch();

    console.log("result", result);
    console.log("result2", result2);
};

// gets user's IP address and retrieves initial data back + calls all need functions
$.ajax({
    url: "src/php/currentLocation.php",
    type: "GET",
    dataType: "json",
    data: {
        key: "1916b969238f4383b66a16126e6dfb2e",
    },
    success: function(result) {
        latitude = result.data.latitude;
        longitude = result.data.longitude;
        countryCode3 = result.data.country_code3;
        countryCode2 = result.data.country_code2;
        countryName = result.data.country_name;
        capitalCity = result.data.country_capital;
        //gives the title of the country
        $("#countryTitle").html(countryName);
        renderMap();
        getCapitalCity();
        getWeatherData();
        photoGallery();
        countryPolygon();
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    },
});

//adds selection of countries to the input
$.ajax({
    url: "src/php/countriesSelection.php",
    type: "GET",
    dataType: "json",
    data: {},
    success: function(result) {
        result.data.map((item) => {
            $("#searchInput").append(
                "<option value=" + item.alpha2Code + " >" + item.demonym + "</option>"
            );
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    },
});

//react to the search selection and updates the map based upon it
$("#searchInput").on("change", function(e) {
    $("#loadingContainer").css("display", "block");
    const currentValue = $("#searchInput").val();
    $.ajax({
        url: "src/php/getCountryDetails.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode: currentValue,
        },
        success: function(result) {
            countryCode2 = result.data.alpha2Code;
            countryCode3 = result.data.alpha3Code;
            countryName = result.data.name;
            capitalCity = result.data.capital;
            getCapitalCity();
            getWeatherData();
            photoGallery();
            countryPolygon();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
});