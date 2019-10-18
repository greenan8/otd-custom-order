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
var allColors;
var allPrintOptions;
var clothingRecords = {};

function getAirtableData(){  

    clothingBase('Colors').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
            allColors = records;
    }); 

    clothingBase('Print').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
            allPrintOptions = records;
    }); 

    clothingBase('Clothing').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        allRecords = records;
        records.forEach(function(record){
        
            // currentRecordName = record.get('Name');
            // clothingRecords[currentRecordName] = {'id': record.id, 'colorOptions': [], 'logoPrintOptions': [], 'textPrintOptions': []}
            clothingRecords[record.id] = {'colorOptions': [], 'logoPrintOptions': [], 'textPrintOptions': [], 'amsPrice': record.get('AMS Price'), 'comPrice': record.get('COM Price')}
            
           colorOptions = record.get('Color Options');
            colorOptions && colorOptions.forEach(function(option){
                clothingRecords[record.id]['colorOptions'].push(option); 
            });

            logoPrintOptions = record.get('Logo Print Options');
            logoPrintOptions && logoPrintOptions.forEach(function(option){
                clothingRecords[record.id]['logoPrintOptions'].push(option); 
                console.log(option);
            });

            textPrintOptions = record.get('Text Print Options');
            textPrintOptions && textPrintOptions.forEach(function(option){
                clothingRecords[record.id]['textPrintOptions'].push(option); 
            });
        });


        // allRecords = records;
        // records.forEach(function(record){
        //     var currentRecordName = record.get('Name');
        //     if (!(currentRecordName in clothingRecords)){
        //         clothingRecords[currentRecordName] = {'default': record.id, 'options': new Array()};
        //     }
        //     else{
        //         clothingRecords[currentRecordName]['options'].push({"id": record.id, "color": record.get('Color Option')});
        //     }
        // });
    });  

};

getAirtableData()



//setting up app (aka getting express, view engine, and static files good to go)
var express = require('express');
var app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));


//Load webapp
app.get('/', (req, res) => {
    res.render('index', {allRecords, clothingRecords, allColors, allPrintOptions});
});

//admin page is to resync data
app.get('/admin', (req, res) => { 
    getAirtableData()
    res.send(
        "<h1>All Clothing Records</h1>" +
        JSON.stringify(allRecords) +
        "<h1>Clothing Defaults and ids</h1>" +
        JSON.stringify(clothingRecords) +
        "<h1>All Colors</h1>" +
        JSON.stringify(allColors)
        );
});

//sending clothing records to front end js
app.get('/allRecords', (req, res) => {
    res.send(allRecords);
});

app.get('/allColors', (req, res) => {
    res.send(allColors);
});

app.get('/clothingRecords', (req, res) => {
    res.send(clothingRecords);
});

app.get('/allPrintOptions', (req, res) => {
    res.send(allPrintOptions);
});

//Mailing submitted form to otd email




app.listen(3000); 

