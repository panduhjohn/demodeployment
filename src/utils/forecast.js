const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url =
        'https://api.darksky.net/forecast/bfc7bbe6794f8cc2ab70b9a2f33e7a21/' + latitude + ',' + longitude;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to services', undefined);
        } else if (body.error) {
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, 'The weather is ' + body.daily.data[0].summary.toLowerCase() + ' With a temp of ' + body.currently.temperature + ' and a ' + body.currently.precipProbability + '% chance of rain.');
        }
    });
};

module.exports = forecast