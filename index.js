//============================= airtable =============================
require('dotenv').config()
var Airtable = require('airtable');
const clothingBase = Airtable.base('appmKG59YjZb91BWI');
const costBase = Airtable.base('app5mCikyR5hw6gLp');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'YOUR_API_KEY'
});

//allRecords will store the first page data from the clothing base (Can store up to 100 records)
var allRecords;
var allColors;
var logoPrintOptions;
var clothingRecords = {};

function getAirtableData(){  

    clothingBase('Colors').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
            allColors = records;
    }); 

    clothingBase('Logo Print').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
            logoPrintOptions = records;
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
                clothingBase('Logo Print').find(option, function(err, logoPrintRecord) {
                    if (err) { console.error(err); return; }
                    clothingRecords[record.id]['logoPrintOptions'].push(logoPrintRecord.get('Name')); 
                });
             
                
            });

            textPrintOptions = record.get('Text Print Options');
            textPrintOptions && textPrintOptions.forEach(function(option){
                clothingRecords[record.id]['textPrintOptions'].push(option); 
            });
        });
    });  

};

var margins={}, printCost={}, printExtraCosts={}, stitchCost={}, stitchExtraCosts={};


function getAirtableCostData(){  
    
    costBase('Margins').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record){
           margins[record.get("Name")] = record.get("Margin");
        }); 
    }); 

    costBase('Printing Additional Charges').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record){
           printExtraCosts[record.get("Name")] = record.get("Price");
        }); 
    }); 

    costBase('Stitching Additional Charges').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record){
            stitchExtraCosts[record.get("Name")] = record.get("Price");
        }); 
    }); 

    //todo: printcosts and stitchcost
    costBase('Printing Charges').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record){
            printCost[record.get("Order Quantity")] = {};
            for(x=1; x<7; x++){
            printCost[record.get("Order Quantity")][x] = record.get(x.toString());   
            }
        });   
    }); 

    costBase('Stitching Charges').select({
        view: 'Grid view'
    }).firstPage(function(err, records) {
        if (err) { console.error(err); return; }
        records.forEach(function(record){
            stitchCost[record.get("Order Quantity")] = {};
            for(x=1999; x<30000; x+= 1000){
            stitchCost[record.get("Order Quantity")][x] = record.get(x.toString());   
            }
        });  
        
    }); 
};

//calling both to retrieve data when server loadas
getAirtableData()
getAirtableCostData()


//============================= express setup =============================
//setting up app (aka getting express, view engine, and static files good to go)
var express = require('express');
var app = express();
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));


//============================= All paths =============================
//Load webapp
app.get('/', (req, res) => {
    res.render('index', {allRecords, clothingRecords, allColors, logoPrintOptions});
});

//admin page is to resync data
app.get('/admin', (req, res) => { 
    getAirtableData()
    getAirtableCostData()
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

app.get('/logoPrintOptions', (req, res) => {
    res.send(logoPrintOptions);
});


//sending cost records to front end js
app.get('/margins', (req, res) => {
    res.send(margins);
});

app.get('/printCost', (req, res) => {
    res.send(printCost);
});

app.get('/printExtraCosts', (req, res) => {
    res.send(printExtraCosts);
});

app.get('/stitchCost', (req, res) => {
    res.send(stitchCost);
});

app.get('/stitchExtraCosts', (req, res) => {
    res.send(stitchExtraCosts);
});

//============================= nodemailer =============================




app.listen(3000); 

