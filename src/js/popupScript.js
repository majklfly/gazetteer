const currentCountryCode = localStorage.getItem("countryCode");

// handles calling details about contry and implementing in dom
const getCountryDetails = () => {
    fetch("https://restcountries.eu/rest/v2/alpha/" + currentCountryCode)
        .then((response) => response.json())
        .then((data) => {
            let currencies = "";
            data.currencies.map(
                (currency) =>
                (currencies += ` code: ${currency.code}, name: ${currency.name}, symbol: ${currency.symbol}`)
            );

            let languages = "";
            data.languages.map(
                (language) =>
                (languages += `code: ${language.iso639_2}, name: ${language.name}, native name: ${language.nativeName} </br>`)
            );

            document.getElementById("continent").innerHTML = data.region;
            document.getElementById("subregion").innerHTML = data.subregion;
            document.getElementById("population").innerHTML = data.population;
            document.getElementById("fullName").innerHTML = data.name;
            document.getElementById("currency").innerHTML = currencies;
            document.getElementById("languages").innerHTML = languages;

            const img = document.getElementById("flag");
            img.src = data.flag;
        });
};

getCountryDetails();