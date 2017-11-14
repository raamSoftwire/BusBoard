var xhttp = new XMLHttpRequest();

function functionOnClick(form)
{
    postcode = form.postcode.value;
    postcodeString = 'http://localhost:3000/departureBoards?postcode=' + postcode;
    xhttp.open('GET', postcodeString, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
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
    return moment(expArr).format("HH:mm") + "\t" +
        lineName + " towards " + destName + ", arriving "
        + timeTilArrival
}


xhttp.onload = function() {
    obj = JSON.parse(xhttp.response);
    document.getElementById('stopHeader0').innerHTML = obj[0][0].stationName;
    document.getElementById('stopHeader1').innerHTML = obj[1][0].stationName;

    for(i=0; i<2; i++)
    {
        stopList = document.getElementById('stopList'+ i);

        while ( stopList.hasChildNodes()) {
            stopList.removeChild(stopList.firstChild);
        }
        stringArray = [];
        for(j =0; j<5; j++)
        {
            str = displayBusData(obj[i][j]);
            stringArray.push(str);
        }

        stopList.appendChild(makeUL(stringArray));
    }

    console.log(xhttp.response);
    // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
};











