const readlineSync = require('readline-sync');
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
    .then(BusStopIds => BusStopIds.map(busHelper.displayBusData));