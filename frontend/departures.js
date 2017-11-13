var xhttp = new XMLHttpRequest();

function functionOnClick(form)
{
    postcode = form.postcode.value;
    postcodeString = 'http://localhost:3000/departureBoards?postcode=' + postcode;
    xhttp.open('GET', postcodeString, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}


xhttp.onload = function() {
    obj = JSON.parse(xhttp.response);
    document.getElementById('stop1Header') = obj[0][0].stationName;
    console.log(xhttp.response);
    // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
};





