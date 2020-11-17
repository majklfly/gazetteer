import $ from "jquery";
import { leafletmap } from "./leaflet";
import { ajaxGet } from "./utils";

// fetch data from countries api and append the code and name to the select option
export const countriesSelection = async() => {
    const list = await ajaxGet("countriesSelection.php");
    list.map((item) => {
        $("#countries").append(
            `<option value=${item.countryCode}>${item.countryName}</option>`
        );
    });
};

//update localstorage based on recieved data
$("#searchInput").on("change", async function(e) {
    const currentValue = $("#searchInput").val();
    localStorage.setItem("countryCode", currentValue);
    const data = await ajaxGet("getCountryDetails.php", {
        country: currentValue,
    });
    localStorage.setItem("countryCode3", data[0].isoAlpha3);
    localStorage.setItem("countryName", data[0].countryName);
    localStorage.setItem("latitude", data[0].south);
    localStorage.setItem("longitude", data[0].west);
    window.location.reload();
});