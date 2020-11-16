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
            $(function() {
                $(document).ready(function() {
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
            });
            data.results.map((item) =>
                $("#lightgallery").append(
                    "<a href=" +
                    item.urls.full +
                    " class='galleryItem'><img src=" +
                    item.urls.small +
                    " /></a>"
                )
            );
        });
};