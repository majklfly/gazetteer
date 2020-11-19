import $ from "jquery";
import { ajaxGet } from "./utils";

// fetch data from countries api and append the code and name to the select option
export const countriesSelection = async() => {
    try {
        const list = await ajaxGet("countriesSelection.php");
        list.map((item) => {
            $("#countries").append(
                `<option value=${item.countryCode}>${item.countryName}</option>`
            );
        });
    } catch (e) {
        console.log(e);
    }
};