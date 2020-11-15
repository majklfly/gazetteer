import $ from "jquery";
import Chart from "chart.js";
import moment from "moment";

export const covidFetch = () => {
    const countryCode = localStorage.getItem("countryCode");
    $.ajax({
        url: "https://api.covid19api.com/total/dayone/country/" + countryCode,
        type: "GET",
        dataType: "json",
        success: function(result) {
            const data = [];
            const labels = [];
            result.map((day) => {
                data.push(day.Active);
                labels.push(moment(day.Date).format("DD/MM"));
            });
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
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        },
    });
};