const path = require('path');
const express = require('express');
const hbs = require('hbs');
const request = require('request');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();
const port = 3000;

//! Define paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//! Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//! Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'John S.'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'John S.'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'this is some text trying to be helpful',
        title: 'Help Page',
        name: ' John S.'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Put in a goddamn location'
        });
    }

    geocode(
        req.query.address,
        (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error });
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error });
                }
                res.send({
                    forecast: forecastData,
                    location: location,
                    address: req.query.address
                });
            });
        }
    );
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query.search);

    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Help',
        name: 'John S',
        errorMessage: 'Help article not found'
    });
});

app.get('/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'John S',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
