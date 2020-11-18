import $ from "jquery";

//function to make get ajax call to a php file and return json data
export const ajaxGet = async(phpFile, data) => {
    let response;
    let error;
    await $.ajax({
        url: "http://localhost/gazetteer/src/php/" + phpFile,
        type: "GET",
        dataType: "json",
        data: data,
        success: function(result) {
            response = result;
        },
        error: function(errorThrown) {
            error = errorThrown;
        },
    });
    if (response) {
        return response.data;
    } else {
        return error;
    }
};