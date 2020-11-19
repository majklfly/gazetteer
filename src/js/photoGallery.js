import Unsplash, { toJson } from "unsplash-js";
import "lightgallery/dist/js/lightgallery-all.min";
import $ from "jquery";
import "lg-zoom";
import "lg-pager";
import "lg-fullscreen";

export const fetchDataForGallery = () => {
    const countryName = localStorage.getItem("countryName");

    const unsplash = new Unsplash({ accessKey: UNSPLASH_ACCESS_KEY });
    unsplash.search
        .photos(countryName, 1, 10, { orientation: "landscape" })
        .then(toJson)
        .then((data) => {
            $(".galleryItem").remove();
            data.results.map((item, index) => {
                $("#" + index).attr("href", item.urls.full);
                $("#img" + index).attr("src", item.urls.small);
                console.log(index);
            });
            $("#lightgallery").lightGallery({
                cssEasing: "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
                closable: false,
                enableTouch: false,
                enableDrag: false,
                loop: true,
                speed: 1500,
                autoplayControls: false,
                zoom: false,
                rotate: false,
                share: false,
            });
        });
};