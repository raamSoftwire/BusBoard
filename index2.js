const readlineSync = require('readline-sync');
const moment = require('moment');
const busHelper = require('./busHelper');
const rp = require('request-promise-native');

const postcode = readlineSync.question('Please enter a postcode : ');
const postcodeRequestString = 'https://api.postcodes.io/postcodes/' + postcode;


function makeBusStopRequestString(body)
{
    obj = JSON.parse(body);
    const lat = obj.result.latitude;
    const lon = obj.result.longitude;

    busStopRequestString = 'https://api.tfl.gov.uk/StopPoint?stopTypes=%20NaptanPublicBusCoachTram' +
        '&radius=400&useStopPointHierarchy=false&modes=bus&returnLines=false&lat='
        + lat +'&lon=' + lon;

    return busStopRequestString
}


function makeBusTimesRequestStrings(body)
{
    obj = JSON.parse(body);
    const stopPoints = obj.stopPoints;

    stopPoints.sort(function(a,b)
    {
        return a.distance - b.distance;
    });
    result = [];
    for (i = 0; i < 2 ; i++)
    {
        result.push('https://api.tfl.gov.uk/StopPoint/' + stopPoints[i].naptanId
            + '/Arrivals?app_id=72ae2528&app_key=e51178ced390783e1bc24c32fe85b8d1');
    }
    return result
}


rp(postcodeRequestString, (error, response, body) => body)
    .then(makeBusStopRequestString)
    .then((string) => rp(string, (error, response, body) => body))
    .then(makeBusTimesRequestStrings)
    .then();
console.log('here');