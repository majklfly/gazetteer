import $ from "jquery";
import { ajaxGet } from "./utils";

// fetch data from countries api and append the code and name to the select option
export const countriesSelection = async() => {
    try {
        const list = await ajaxGet("countriesSelection.php");
        console.log(list);
        list.map((item) => {
            $("#countries").append(
                `<option value=${item.alpha2Code}>${item.name}</option>`
            );
        });
    } catch (e) {
        console.log("CountrySelectionError", e);
    }
};