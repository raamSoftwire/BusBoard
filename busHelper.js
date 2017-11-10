const moment = require('moment');


function getArrivalTime(obj)
{
    const unixTime = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en').valueOf();
    return unixTime;

}

function getTimeTilArrival(obj)
{
    const expArr = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en');
    const timeTilArrival = expArr.fromNow();
    return timeTilArrival;

}

function displayBusTimes(obj)
{
    const expArr = moment(obj.expectedArrival,"YYYY-MM-DDTHH:mm:ssZ",'en');
    const lineName = obj.lineName;
    const destName = obj.destinationName;
    const timeTilArrival = getTimeTilArrival(obj);

    console.log(
        moment(expArr).format("HH:mm") + "\t" +
        lineName + " towards " + destName + " arriving "
        + timeTilArrival);
}

module.exports = {getArrivalTime, displayBusTimes};