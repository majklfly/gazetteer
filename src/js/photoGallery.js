import Unsplash, { toJson } from "unsplash-js";
import $ from "jquery";
import "lightgallery.js";

const unsplash = new Unsplash({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

console.log("runned");

$(document).ready(function() {
    $("#lightgallery").lightGallery({
        showThumbByDefault: true,
        addClass: "showThumbByDefault",
    });
});

export const fetchDataForGallery = () => {
    unsplash.search
        .photos("london", 1, 3, { orientation: "landscape" })
        .then(toJson)
        .then((json) => {
            console.log("gallery", json);
        });
};