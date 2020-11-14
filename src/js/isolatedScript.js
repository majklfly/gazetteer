console.log("wiiiiii");

const currentCountryCode = localStorage.getItem("countryCode");

const getCountryDetails = () => {
    fetch("https://restcountries.eu/rest/v2/alpha/" + currentCountryCode)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("continent").innerHTML = data.region;
        });
};

getCountryDetails();