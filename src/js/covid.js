import $ from "jquery";
import Chart from "chart.js";
import moment from "moment";

import { ajaxGet } from "./utils";

export const covidFetch = async() => {
    const countryCode = localStorage.getItem("countryCode");

    try {
        const result = await ajaxGet("covidDetails.php", {
            countryCode: countryCode,
        });
        const data = [];
        const labels = [];

        if (result) {
            result.map((day) => {
                data.push(day.Active);
                labels.push(moment(day.Date).format("DD/MM"));
            });
        }

        var ctx = $("#myChart");
        var myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "# Confirmed cases",
                    data: data,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                }, ],
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                    }, ],
                },
            },
        });
    } catch (e) {
        console.log(e);
    }
};