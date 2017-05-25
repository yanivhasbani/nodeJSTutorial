/**
 * Created by yaniv on 5/25/17.
 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');


const port = process.env.PORT || 4000;
var app = express();

//Partials - A HTML code that can be re-used in hbs files
hbs.registerPartials(__dirname + '/views/partials');

//Set express view engine to hbs
app.set('view engine', 'hbs');

//MiddleWare - logic extensions to express
//E.G: change the response the app.get gets before it is called

//Register MiddleWare
//next - tell explain when we are done
app.use((req, res, next) => {
    var now = new Date();
    var dateStr = `${now.toDateString()},(${now.toTimeString()})`;
    var log = `${dateStr}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//Register Middleware static folder.
app.use(express.static(__dirname + '/public'));

//Helpers

//Helper is the way to pass JS functionality to hbs files
//Helper are searched first inside {{}} and then data
//Called by name
hbs.registerHelper('getCurrentYear', () => {
   return new Date().getFullYear();
});

//A helper with params
//Called as {{funcName argument}}
//E.G: {{screamIt 'helloooo'}}
hbs.registerHelper('screamIt', (lowerCapText) => {
    return lowerCapText.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my awesome page'});
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
        pageTitle: 'About Page'});
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Error handling'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});