const request = require('request');
const readlineSync = require('readline-sync');
const moment = require('moment');
const busHelper = require('./busHelper');
const rp = require('request-promise-native');


const postcode = readlineSync.question('Please enter a postcode : ');
const postcodeRequestString = 'https://api.postcodes.io/postcodes/' + postcode;

function initialise() {
    request(postcodeRequestString, postcodeResponseHandler);
}

function postcodeResponseHandler(error, response, body)
{
    obj = JSON.parse(body);
    const lat = obj.result.latitude;
    const lon = obj.result.longitude;

    busStopRequestString = 'https://api.tfl.gov.uk/StopPoint?stopTypes=%20NaptanPublicBusCoachTram' +
        '&radius=400&useStopPointHierarchy=false&modes=bus&returnLines=false&lat='
        + lat +'&lon=' + lon;

    request(busStopRequestString,busStopResponseHandler);
}

function busStopResponseHandler(error,response,body)
{
    obj = JSON.parse(body);
    const stopPoints = obj.stopPoints;

    stopPoints.sort(function(a,b)
    {
        return a.distance - b.distance;
    });

    for (i = 0; i < 2 ; i++)
    {
        requestString = 'https://api.tfl.gov.uk/StopPoint/' + stopPoints[i].naptanId
            + '/Arrivals?app_id=72ae2528&app_key=e51178ced390783e1bc24c32fe85b8d1';

        request(requestString, responseHandler);
    }

}

function responseHandler (error, response, body)
{
    const data = JSON.parse(body);
    data.sort(function(a,b){
        return busHelper.getArrivalTime(a) - busHelper.getArrivalTime(b)
    });

    console.log(data[0].stationName + "\n");

    for(i = 0; i < 5; i++)
        busHelper.displayBusTimes(data[i]);

    console.log("\n");
}

initialise();


// getCoordinatesForPostcode(postcode)
//     .then(coordinates => getBusStopsForCoordinates(coordinates))
//     .then(busStops => Promise.all(busStops.map(busStop => getArrivalsForBusStop(busStop))))
//     .then(arrivals => console.log(arrivals)); // this looks bad





