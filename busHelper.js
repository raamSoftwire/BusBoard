const moment = require('moment');
const rp = require('request-promise-native');


function getArrivalTime(obj)
{
    const unixTime = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en').valueOf();
    return unixTime;
}

function sortByDistance(stopPoints)
{
    return stopPoints.sort(function(a,b)
    {
        return a.distance - b.distance;
    })
}

function sortByArrivalTime(busDataArray)
{
    return busDataArray.sort(function(a,b)
    {
        return getArrivalTime(a) - getArrivalTime(b)
    })
}

function makeStopDetailsRequestString(stopId)
{
    return 'https://api.tfl.gov.uk/StopPoint/' + stopId
        + '/Arrivals?app_id=72ae2528&app_key=e51178ced390783e1bc24c32fe85b8d1';
}

function getBusData(stopId)
{
    return rp(makeStopDetailsRequestString(stopId))
        .then(JSON.parse)
        .then(busDataArray => sortByArrivalTime(busDataArray))
        .then(busDataArray => busDataArray.slice(0,5))
}

module.exports = {sortByDistance, getBusData};