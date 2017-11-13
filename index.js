const readlineSync = require('readline-sync');
const busHelper = require('./busHelper');
const rp = require('request-promise-native');
const express = require('express');
const app = express();

const postcode = 'NW5 1TL';//readlineSync.question('Please enter a postcode : ');


//app.get('/departureBoards', (req, res) => res.send(getJSON(req.query.postcode)));

app.listen(3000, () => console.log('Example app listening on port 3000!'))





function getCoordinatesFromPostcode(postcodeString)
{
    const postcodeRequestString = 'https://api.postcodes.io/postcodes/' + postcodeString;

    return rp(postcodeRequestString)
        .then(JSON.parse)
        .then(obj => [obj.result.latitude, obj.result.longitude])
}


function getBusStopIDsFromCoordinates(coordinates)
{
    busStopRequestString = 'https://api.tfl.gov.uk/StopPoint?stopTypes=%20NaptanPublicBusCoachTram' +
        '&radius=400&useStopPointHierarchy=false&modes=bus&returnLines=false&lat='
        + coordinates[0] +'&lon=' + coordinates[1];
    return rp(busStopRequestString)
        .then(JSON.parse)
        .then(obj => obj.stopPoints)
        .then(stopPoints => busHelper.sortByDistance(stopPoints))
        .then(stopPoints => stopPoints.slice(0,2))
        .then(stopPoints => stopPoints.map(stopPoint => stopPoint['naptanId'])
        )
}



getCoordinatesFromPostcode(postcode)
    .then(coordinates => getBusStopIDsFromCoordinates(coordinates))
    .then(BusStopIds => Promise.all(BusStopIds.map(busHelper.getBusData)))
    .then(RESULT => app.get('/departureBoards', (req, res) => res.send(RESULT)))


// getCoordinatesFromPostcode(postcode)
//     .then(coordinates => getBusStopIDsFromCoordinates(coordinates))
//     .then(BusStopIds => Promise.all(BusStopIds.map(busHelper.getBusData)))
//     .then(busData => busData.map(busHelper.displayBusData));

