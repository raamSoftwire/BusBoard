const request = require('request');
const readlineSync = require('readline-sync');
const moment = require('moment');

const stopCode = '490008660N';
const requestString = 'https://api.tfl.gov.uk/StopPoint/' + stopCode + '/Arrivals';


function getArrivalTime(obj)
{
    const unixTime = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en').valueOf();
    return unixTime;

}

function getTimeTilArrival(obj)
{
    const now = moment();
    const expArr = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en');
    const timeTilArrival = moment(expArr.diff(now)).format("HH:mm");
    return timeTilArrival;

}

function displayBusTimes(obj)
{
    const expArr = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en');
    const lineName = obj.lineName;
    const destName = obj.destinationName;
    const timeTilArrival = getTimeTilArrival(obj);

    console.log(lineName + " towards " + destName + " arriving at "
        + moment(expArr).format("HH:mm") + " " + timeTilArrival);
}

function responseHandler (error, response, body)
{
    const data = JSON.parse(body);
    data.sort(function(a,b){
        return getArrivalTime(a) - getArrivalTime(b)
    });

    for(i = 0; i < 5; i++)
    {
        displayBusTimes(data[i]);
    }

}

request(requestString, responseHandler);

// moment(date,["DD/MM/YYYY","YYYY-MM-DD"],'en').format("DD/MM/YYYY");