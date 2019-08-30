//retrieving different clothing options from airtable base
require('dotenv').config()
var Airtable = require('airtable');
const clothingBase = Airtable.base('appmKG59YjZb91BWI');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'YOUR_API_KEY'
});
//allRecords will store the first page data from the clothing base (Can store up to 100 records)
var allRecords;
clothingBase('Clothing').select({
    view: 'Grid view'
}).firstPage(function(err, records) {
    if (err) { console.error(err); return; }
    allRecords = records;
});

//setting up app (aka getting express, view engine, and static files good to go)
var express = require('express');
var app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));


//Load webapp
app.get('/', (req, res) => {
    res.render('index', {allRecords});
});

//post submission from user to order table
app.post('/', (req, res) => {
    res.render('index');
});

//admin page is to resync data
app.get('/admin', (req, res) => { 
    clothingBase('Clothing').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        allRecords = records;
        res.send(allRecords); 
    });  
});



app.listen(3000); 

