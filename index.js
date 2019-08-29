require('dotenv').config()
var Airtable = require('airtable');
const clothingBase = Airtable.base('appmKG59YjZb91BWI');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'YOUR_API_KEY'
});
var allRecords;

clothingBase('Clothing').select({
    view: 'Grid view'
}).firstPage(function(err, records) {
    if (err) { console.error(err); return; }
    allRecords = records;
});


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

//allow for data update
app.get('/admin', (req, res) => {
    res.send("admin page"); 
    clothingBase('Clothing').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        allRecords = records;
    });  
});



app.listen(3000); 

