const xhttp = new XMLHttpRequest();

function getQuery(postcode)
{
    const postcodeString = 'http://localhost:3000/departureBoards?postcode=' + postcode;
    xhttp.open('GET', postcodeString, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}



let timer = 0;
function functionOnClick(form)
{
    const postcode = form.postcode.value;
    getQuery(postcode);
    clearInterval(timer);
    timer = setInterval(getQuery, 10000, postcode);

}

function clear()
{
    document.getElementById('stopHeader0').innerHTML = '';
    document.getElementById('stopHeader1').innerHTML = '';
    for(let i=0; i<2; i++)
    {
        let stopList = document.getElementById('stopList'+ i);

        while ( stopList.hasChildNodes()) {
            stopList.removeChild(stopList.firstChild);
        }
    }
}

function makeUL(myArray, idArray) {

    const list = document.createElement('ul');

    for (let i = 0; i < myArray.length; i++) {
        // Create the list item:
        let item = document.createElement('li');

        nodeToAdd = document.createElement('a');
        nodeToAdd.textContent = (myArray[i]);
        nodeToAdd.href = '/busArrivals?id=' + idArray[i];
        item.appendChild(nodeToAdd);

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
        document.getElementById('stopHeader0').innerHTML = 'Error: no bus stops found';
        return
    }
    console.log(obj);
    document.getElementById('stopHeader0').innerHTML = obj[0][0].stationName;
    document.getElementById('stopHeader1').innerHTML = obj[1][0].stationName;

    for(let i in obj)
    {
        let stopList = document.getElementById('stopList'+ i);

        while ( stopList.hasChildNodes()) {
            stopList.removeChild(stopList.firstChild);
        }
        let stringArray = [];
        let idArray = [];
        for(let j in obj[i])
        {
            let str = displayBusData(obj[i][j]);
            stringArray.push(str);
            idArray.push(obj[i][j].vehicleId);
        }
        stopList.appendChild(makeUL(stringArray, idArray));
    }
    console.log(xhttp.response);
};











