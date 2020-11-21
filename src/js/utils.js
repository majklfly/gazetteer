import $ from "jquery";

//function to make get ajax call to a php file and return json data
export const ajaxGet = async(phpFile, data) => {
    let response;
    let error;
    await $.ajax({
        url: "https://gazetteer-php-server.herokuapp.com/src/" + phpFile,
        dataType: "jsonp",
        contentType: "application/json",
        data: data,
        success: function(result) {
            response = result;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            error = jqXHR;
        },
    });
    if (response) {
        return response.data;
    } else {
        return error;
    }
};

// https://localhost/gazetteer/src/php/

// https://gazetteer-php-server.herokuapp.com/src/