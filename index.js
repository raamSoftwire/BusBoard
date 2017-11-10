const request = require('request');
const readlineSync = require('readline-sync');
const moment = require('moment');
const busHelper = require('./busHelper')


const stopCode = '490008660N';

const postcode = readlineSync.question('Please enter a postcode : ');
const postcodeRequestString = 'https://api.postcodes.io/postcodes/' + postcode;

function initialise() {
    request(postcodeRequestString, postcodeResponseHandler);
}

function postcodeResponseHandler(error, response, body)
{
    obj = JSON.parse(body)
    const lat = obj.result.latitude;
    const lon = obj.result.longitude;
    console.log(lat, lon)
}


//
//













requestString = 'https://api.tfl.gov.uk/StopPoint/' + stopCode
    + '/Arrivals?app_id=72ae2528&app_key=e51178ced390783e1bc24c32fe85b8d1';

request(requestString, responseHandler);


function responseHandler (error, response, body)
{
    const data = JSON.parse(body);
    data.sort(function(a,b){
        return busHelper.getArrivalTime(a) - busHelper.getArrivalTime(b)
    });

    for(i = 0; i < 5; i++)
    {
        busHelper.displayBusTimes(data[i]);
    }

}

initialise();