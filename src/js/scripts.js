// global values used across the application
let latitude;
let longitude;
let countryCode3;
let countryCode2;
let countryName;
let capitalCity;
let map;
let border;
let polygon;
let cityMarkers;
let religionMarkers;
let monumetsMarkers;
let naturalMarkers;
let industrialMarkers;
let architectureMarkers;
let weatherBtn;
let galleryBtn;
let exchangeButton;
let countryInfoButton;

//fetches the pictures and add them to the index.html
const getPhotos = () => {
    $(".galleryPicture").remove();
    let i;
    const nameSanitized = countryName.replace(" ", "");
    const photo = new UnsplashPhoto();
    for (i = 0; i < 12; i++) {
        const photoUrl = photo.all().of([nameSanitized]).fetch();
        $("#image" + i).attr("src", photoUrl);
    }
};

// gets the capital city of the country and adds a marker on the map
const getCapitalCity = () => {
    const capitalRaw = capitalCity;
    const capitalNoSpace = capitalRaw.replace(" ", "");
    $.ajax({
        url: "src/php/capitalCityDetails.php",
        type: "GET",
        dataType: "json",
        data: {
            capitalCity: capitalNoSpace,
            countryCode: countryCode2,
            apiKey: "1856257054eb4dd4a53ffbdc7327374d",
        },
        success: function(result) {
            console.log("capital", result);
            if (result.data) {
                latitude = result.data.lat;
                longitude = result.data.lon;
                $("#sunrise").html(result.data.sunrise);
                $("#sunset").html(result.data.sunset);
                getWeatherData();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};

// creates and adds the markers which are in the polygon
const getMarkers = (data, icon, cluster) => {
    data.map((item) => {
        let lat;
        let lon;
        if (polygon) {
            const p1 = polygon.geometry;
            const p2 = {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [
                        item.geometry.coordinates[0],
                        item.geometry.coordinates[1],
                    ],
                },
            };
            if (turf.inside(p2, p1)) {
                lat = item.geometry.coordinates[1];
                lon = item.geometry.coordinates[0];
            }
        }

        if (lat) {
            const popup = L.popup()
                .setLatLng([lat, lon])
                .setContent(
                    "<div class='cityPopup'><h3>" +
                    item.properties.name +
                    "</h3><a href=https://www.wikidata.org/wiki/" +
                    item.properties.wikidata +
                    ">Get more info...</a></div>"
                );
            const Icon = L.icon({
                iconUrl: "src/img/" + icon,
                iconSize: [25, 25], // size of the icon
                iconAnchor: [17, 32], // point of the icon which will correspond to marker's location
                popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
            });

            const marker = L.marker([lat, lon], {
                icon: Icon,
            }).bindPopup(popup);

            cluster.addLayer(marker);
        }
    });
};

//fetch and renders markups of interesting places on the map
const retrieveAllRelevantPlacesData = (data) => {
    data.map((item, index) => {
        religionMarkers = L.markerClusterGroup();
        monumetsMarkers = L.markerClusterGroup();
        naturalMarkers = L.markerClusterGroup();
        architectureMarkers = L.markerClusterGroup();

        $.ajax({
            url: "src/php/allRelevantPlacesData.php",
            type: "GET",
            dataType: "json",
            data: {
                latitude: item.fields.coordinates[0],
                longitude: item.fields.coordinates[1],
            },
            success: function(result) {
                if (result.religion) {
                    getMarkers(result.religion, "church.png", religionMarkers);
                }
                if (result.palaces) {
                    getMarkers(result.palaces, "palace.png", monumetsMarkers);
                }
                if (result.natural) {
                    getMarkers(result.natural, "cave.png", naturalMarkers);
                }
                if (result.architecture) {
                    getMarkers(result.architecture, "bridge.png", architectureMarkers);
                }
                map.addLayer(religionMarkers);
                map.addLayer(monumetsMarkers);
                map.addLayer(naturalMarkers);
                map.addLayer(architectureMarkers);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            },
        });
    });
};

const getOtherPlaces = () => {
    const countryNameFixed = countryName.replace(" ", "+");
    $.ajax({
        url: "src/php/otherPlaces.php",
        type: "GET",
        dataType: "json",
        data: {
            countryName: countryNameFixed,
        },
        success: function(result) {
            retrieveAllRelevantPlacesData(result.data);
            cityMarkers = L.markerClusterGroup();
            result.data.map((item) => {
                const lat = item.geometry.coordinates[1].toString();
                const lon = item.geometry.coordinates[0].toString();
                // gets the link to the wiki page
                $.ajax({
                    url: "src/php/getWikiData.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        cityName: item.fields.name.replace(" ", "_"),
                    },
                    success: function(result) {
                        if (result.data) {
                            const popup = L.popup()
                                .setLatLng([lat, lon])
                                .setContent(
                                    "<div class='cityPopup'><h3>" +
                                    item.fields.name +
                                    "</h3><a href=" +
                                    result.data[3][0] +
                                    ">Get more info...</a></div>"
                                );
                            const Icon = L.icon({
                                iconUrl: "src/img/marker.png",
                                iconSize: [25, 25], // size of the icon
                                iconAnchor: [17, 32], // point of the icon which will correspond to marker's location
                                popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
                            });

                            const marker = L.marker([lat, lon], {
                                icon: Icon,
                            }).bindPopup(popup);

                            cityMarkers.addLayer(marker);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR, errorThrown);
                    },
                });
            });
            map.addLayer(cityMarkers);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, errorThrown);
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
            $("#wind").html(
                "Wind: " +
                result.current.wind_kph +
                "kph / " +
                result.current.wind_mph +
                "mph"
            );
            $("#temp").html(
                "Temp: " +
                result.current.temp_c +
                "°C / " +
                result.current.temp_f +
                "°F"
            );
            $("#update").html("Last Update: " + result.current.last_updated);
            $("#weatherPicture").attr("src", result.current.condition.icon);
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
            getOtherPlaces();
            polygon = result.data;
            border = L.geoJson(result.data, {
                color: "#ff7800",
                weight: 2,
                opacity: 0.65,
            }).addTo(map);

            map.flyToBounds(border.getBounds());
            $("#loadingContainer").css("display", "none");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, errorThrown);
        },
    });
};

// renders the leaflet map with buttons on the side
const renderMap = () => {
    map = L.map("mapid").setView([latitude, longitude], 6).fitWorld();

    L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
            maxZoom: 19,
        }
    ).addTo(map);

    weatherBtn = L.easyButton({
        states: [{
            stateName: "openWeather",
            icon: "<img src='https://img.icons8.com/color/48/000000/partly-cloudy-day--v1.png' class='buttonIcon'/>",
            title: "weather",
            onClick: function(btn, map) {
                const attrValue = $("#weatherContainer").css("display");
                attrValue === "block" ?
                    $("#weatherContainer").css("display", "none") :
                    $("#weatherContainer").css("display", "block");
            },
        }, ],
    });
    weatherBtn.addTo(map);

    L.easyButton(
        "<img src='https://img.icons8.com/color/48/000000/gallery.png' class='buttonIcon' />",
        function(btn, map) {
            galleryBtn = btn;
            $("#galleryModal").modal("show");
        }
    ).addTo(map);

    L.easyButton(
        "<img src='https://img.icons8.com/color/48/000000/banknotes.png' class='buttonIcon' />",
        function(btn, map) {
            exchangeBtn = btn;
            $("#exchangeModal").modal("show");
        }
    ).addTo(map);

    L.easyButton(
        "<img src='https://img.icons8.com/color/48/000000/info--v1.png' class='buttonIcon'/>",
        function(btn, map) {
            countryInfoButton = btn;
            $("#exchangeModal").modal("show");
        }
    ).addTo(map);

    markers = L.markerClusterGroup();
};

//react to the search selection and updates the map based upon it
$("#searchInput").on("change", function(e) {
    map.eachLayer((layer) => {
        if (layer.dragging) {
            layer.remove();
        }
    });
    const currentValue = $("#searchInput").val();
    $.ajax({
        url: "src/php/getCountryDetails.php",
        type: "GET",
        dataType: "json",
        data: {
            countryCode: currentValue,
        },
        success: function(result) {
            $("#loadingContainer").css("display", "block");
            $("#mapid").css("display", "flex");
            $("#buttonsContainer").css("display", "flex");
            $("#gallery").css("display", "none");
            countryCode2 = result.data.alpha2Code;
            countryCode3 = result.data.alpha3Code;
            countryName = result.data.name;
            capitalCity = result.data.capital;
            localStorage.setItem("countryCode", result.data.alpha2Code);
            $("#countryTitle").html(result.data.name);
            if (typeof marker !== "undefined") {
                map.removeLayer(marker);
            }
            getCapitalCity();
            getPhotos();
            countryPolygon();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
});

// ---- CHARTJS CONVERTER LOGIC ------

const formatCurrentDate = () => {
    const d = new Date();
    const currentDate =
        d.getFullYear().toString() +
        "-" +
        (d.getMonth() + 1).toString() +
        "-" +
        d.getDate().toString();
    return currentDate;
};

const calculateMonthAgo = () => {
    var d = new Date();
    const priorDate =
        d.getFullYear().toString() +
        "-" +
        d.getMonth().toString() +
        "-" +
        d.getDate().toString();
    return priorDate;
};

let data = [];
let labels = [];

const getCurrencyHistory = (symbols, base) => {
    const end = formatCurrentDate();
    const start = calculateMonthAgo();

    $.ajax({
        url: "src/php/getCurrencyHistory.php",
        type: "GET",
        dataType: "json",
        data: {
            symbols: symbols,
            base: base,
            start: start,
            end: end,
        },
        success: function(result) {
            data = [];
            labels = [];
            for (const [key, value] of Object.entries(result.data.rates)) {
                const valueSanitized = parseFloat(value[symbols]).toFixed(4);
                data.push(valueSanitized);
                labels.push(key);
                renderGraph();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};

const renderGraph = () => {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels.sort(),
            datasets: [{
                label: "Rate",
                data: data.sort(),
                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)"],
                borderWidth: 1,
            }, ],
        },
    });
};

// ---- CURRENCY CONVERTER LOGIC ------

let baseCurrency = "GBP";
let baseNumber = 1;
let targetCurrency = "CAD";
let targetNumber;

const currencyConverter = (
    baseCurrency,
    baseNumber,
    targetCurrency,
    targetNumber
) => {
    $.ajax({
        url: "src/php/getCurrencyDetail.php",
        type: "GET",
        dataType: "json",
        data: {
            baseCurrency: baseCurrency,
            targetCurrency: targetCurrency,
        },
        success: function(result) {
            const rateValue = result.data.rates[targetCurrency];
            const updatedTargetValue = baseNumber * rateValue;
            $("#targetNumber").val(updatedTargetValue);
            getCurrencyHistory(targetCurrency, baseCurrency);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};

const reversedCurrencyConverter = (
    baseCurrency,
    baseNumber,
    targetCurrency,
    targetNumber
) => {
    $.ajax({
        url: "src/php/getCurrencyDetail.php",
        type: "GET",
        dataType: "json",
        data: {
            baseCurrency: targetCurrency,
            targetCurrency: baseCurrency,
        },
        success: function(result) {
            const rateValue = result.data.rates[baseCurrency];
            const updatedBaseValue = targetNumber * rateValue;
            $("#baseNumber").val(updatedBaseValue);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};

//listeners for the money converter
$("#baseNumber").on("change", function() {
    baseNumber = $(this).val();
    currencyConverter(baseCurrency, baseNumber, targetCurrency, targetNumber);
});

$("#baseCurrency").on("change", function() {
    baseCurrency = $(this).val();
    currencyConverter(baseCurrency, baseNumber, targetCurrency, targetNumber);
});

$("#targetNumber").on("change", function() {
    targetNumber = $(this).val();
    reversedCurrencyConverter(
        baseCurrency,
        baseNumber,
        targetCurrency,
        targetNumber
    );
});

$("#targetCurrency").on("change", function() {
    targetCurrency = $(this).val();
    currencyConverter(baseCurrency, baseNumber, targetCurrency, targetNumber);
});

// ---- ON LOAD FUNCTIONS ------

// listener which closes the hamburger after a click
$(".navbar-nav>div").on("click", function() {
    $(".navbar-collapse").collapse("hide");
});

// gets user's IP address and retrieves initial data back + calls all need function
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
        localStorage.setItem("countryCode", result.data.country_code2);
        //gives the title of the country
        $("#countryTitle").html(result.data.country_name);
        renderMap();
        getCapitalCity();
        getWeatherData();
        getPhotos();
        countryPolygon();
        currencyConverter(baseCurrency, baseNumber, targetCurrency, targetNumber);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    },
});

//retrieve all possible currencies
$.ajax({
    url: "src/php/retrieveAllCurrencies.php",
    type: "GET",
    dataType: "json",
    data: {},
    success: function(result) {
        for (const [key, value] of Object.entries(result.data)) {
            $(".currencyOptions").append(
                "<option value=" + key + ">" + key + "</option>"
            );
        }
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
                "<option value=" + item.alpha2Code + " >" + item.name + "</option>"
            );
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    },
});