const readlineSync = require('readline-sync');
const busHelper = require('./busHelper');
const rp = require('request-promise-native');
const express = require('express');
const app = express();


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


function getJSON(postcode)
{
    return getCoordinatesFromPostcode(postcode)
        .then(coordinates => getBusStopIDsFromCoordinates(coordinates))
        .then(BusStopIds => Promise.all(BusStopIds.map(busHelper.getBusData)))
}

app.listen(3000);
app.get('/departureBoards',
    (req, res) => getJSON(req.query.postcode)
        .then(JSONdata => res.send(JSONdata)));
