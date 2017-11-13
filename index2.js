const readlineSync = require('readline-sync');
const moment = require('moment');
const busHelper = require('./busHelper');
const rp = require('request-promise-native');


const postcode = 'NW5 1TL';//readlineSync.question('Please enter a postcode : ');


function getCoordinatesFromPostcode(postcodeString)
{
    const postcodeRequestString = 'https://api.postcodes.io/postcodes/' + postcodeString;

    return rp(postcodeRequestString)
        .then(JSON.parse)
        .then(obj => [obj.result.latitude, obj.result.longitude])
}


function sortByDistance(stopPoints)
{
    return stopPoints.sort(function(a,b)
    {
        return a.distance - b.distance;
    })
}

function sortByArrivalTime(busDataArray) {

    return busDataArray.sort(function(a,b)
    {
        return busHelper.getArrivalTime(a) - busHelper.getArrivalTime(b)
    }
    );

}

function getStopId(stopPoint)
{
    return stopPoint.naptanId;
}

function getBusStopIDsFromCoordinates(coordinates)
{
    busStopRequestString = 'https://api.tfl.gov.uk/StopPoint?stopTypes=%20NaptanPublicBusCoachTram' +
        '&radius=400&useStopPointHierarchy=false&modes=bus&returnLines=false&lat='
        + coordinates[0] +'&lon=' + coordinates[1];
    return rp(busStopRequestString)
        .then(JSON.parse)
        .then(obj => obj.stopPoints)
        .then(stopPoints => sortByDistance(stopPoints))
        .then(stopPoints => stopPoints.slice(0,2))
        .then(stopPoints => stopPoints.map(getStopId)
        )
}


function makeStopDetailsRequestString(stopId)
{
    return 'https://api.tfl.gov.uk/StopPoint/' + stopId
        + '/Arrivals?app_id=72ae2528&app_key=e51178ced390783e1bc24c32fe85b8d1';
}

function displayBusData(stopId)
{
    return rp(makeStopDetailsRequestString(stopId))
        .then(console.log)
        .then(busDataArray => sortByArrivalTime(busDataArray))
        .then(busDataArray => busDataArray.slice(0,5))
        // .then(console.log(busDataArray[0].stationName + "\n"))
        .then(busDataArray => busDataArray.map(busHelper.displayBusTimes))



}

// data.sort(function(a,b){
//     return busHelper.getArrivalTime(a) - busHelper.getArrivalTime(b)
// });
//
// console.log(data[0].stationName + "\n");
//
// for(i = 0; i < 5; i++)
//     busHelper.displayBusTimes(data[i]);
//
// console.log("\n");



// obj = JSON.parse(body);
// const stopPoints = obj.stopPoints;
//
// stopPoints.sort(function(a,b)
// {
//     return a.distance - b.distance;
// });
//
// for (i = 0; i < 2 ; i++)
// {
//     requestString = 'https://api.tfl.gov.uk/StopPoint/' + stopPoints[i].naptanId
//         + '/Arrivals?app_id=72ae2528&app_key=e51178ced390783e1bc24c32fe85b8d1';
//
//     request(requestString, responseHandler);
// }


getCoordinatesFromPostcode(postcode)
    .then(coordinates => getBusStopIDsFromCoordinates(coordinates))
    .then(BusStopIds => BusStopIds.map(displayBusData))
// .then(busStops => Promise.all(busStops.map(busStop => getArrivalsForBusStop(busStop))))
//     .then(arrivals => console.log(arrivals)); // this looks bad