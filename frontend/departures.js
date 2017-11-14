var xhttp = new XMLHttpRequest();

function getQuery(postcode)
{
    postcodeString = 'http://localhost:3000/departureBoards?postcode=' + postcode;
    xhttp.open('GET', postcodeString, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}




function functionOnClick(form)
{
    postcode = form.postcode.value;
    getQuery(postcode);
    setInterval(getQuery, 10000, postcode);

}

function clear()
{
    document.getElementById('stopHeader0').innerHTML = '';
    document.getElementById('stopHeader1').innerHTML = '';
    for(i=0; i<2; i++)
    {
        stopList = document.getElementById('stopList'+ i);

        while ( stopList.hasChildNodes()) {
            stopList.removeChild(stopList.firstChild);
        }
    }
}

function makeUL(myArray) {
    // Create the list element:
    var list = document.createElement('ul');

    for (var i = 0; i < myArray.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(myArray[i]));

        // Add it to the list:
        list.appendChild(item);
    }
    return list;
}


function displayBusData(obj)
{
    const expArr = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en');
    const lineName = obj.lineName;
    const destName = obj.destinationName;
    const timeTilArrival = expArr.fromNow();
    const stationName = obj.stationName;
    return moment(expArr).format("HH:mm")+ " " +
        lineName + " to " + destName + ", "
        + timeTilArrival
}


xhttp.onload = function() {
    clear();
    try
    {
        obj = JSON.parse(xhttp.response);
    }
    catch (err)
    {
        if (xhttp.status === 404)
        {
            document.getElementById('stopHeader0').innerHTML = 'Error: invalid postcode'
        }
        else {
            document.getElementById('stopHeader0').innerHTML = 'Unexpected error: ' + xhttp.status;
            return
        }
    }
    if (obj.length === 0)
    {
        document.getElementById('stopHeader0').innerHTML = 'Error: no bus stops found'
        return
    }
    console.log(obj);
    document.getElementById('stopHeader0').innerHTML = obj[0][0].stationName;
    document.getElementById('stopHeader1').innerHTML = obj[1][0].stationName;

    for(i in obj)
    {
        stopList = document.getElementById('stopList'+ i);

        while ( stopList.hasChildNodes()) {
            stopList.removeChild(stopList.firstChild);
        }
        stringArray = [];
        for(j in obj[i])
        {
            str = displayBusData(obj[i][j]);
            stringArray.push(str);
        }


        stopList.appendChild(makeUL(stringArray));
    }

    console.log(xhttp.response);
    // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
};











