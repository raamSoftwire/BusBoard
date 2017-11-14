xhttp = new XMLHttpRequest();
const id = location.href.split('=')[1];
const queryString = '/busArrivalsData/?id=' + id;

xhttp.open('GET', queryString, true);
xhttp.setRequestHeader('Content-Type', 'application/json');
xhttp.send();

function makeUL2(myArray) {
    // Create the list element:
    const list = document.createElement('ul');

    for (let i = 0; i < myArray.length; i++) {
        // Create the list item:
        let item = document.createElement('li');

        nodeToAdd = document.createTextNode(myArray[i]);

        item.appendChild(nodeToAdd);

        // Add it to the list:
        list.appendChild(item);
    }
    return list;
}

function displayArrivalData(obj)
{
    const expArr = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en');
       const timeTilArrival = expArr.fromNow();
    const stationName = obj.stationName;
    return moment(expArr).format("HH:mm")+ " " +
        stationName  +" " + timeTilArrival


}




xhttp.onload = function()
{
    obj = JSON.parse(xhttp.response);

    let arrivalList = document.getElementById('arrivalList');

    stringArray = [];
    for(let j in obj)
    {
        let str = displayArrivalData(obj[j]);
        stringArray.push(str);
    }

    arrivalList.appendChild(makeUL2(stringArray));




    // document.getElementById('arrivalList').innerHTML = obj[0].stationName;

};

