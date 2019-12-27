// ============================= airtable =============================
require('dotenv').config();
const Airtable = require('airtable');

const clothingBase = Airtable.base('appmKG59YjZb91BWI');
const costBase = Airtable.base('app5mCikyR5hw6gLp');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});

// allRecords will store the first page data from the clothing base (Can store up to 100 records)

let allRecords;
let allColors;
let logoPrintOptions;
let clothingRecords = {};

function getAirtableData() {
  clothingBase('Colors')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      allColors = records;
    });

  clothingBase('Logo Print')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      logoPrintOptions = records;
    });

  clothingBase('Clothing')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      allRecords = records;
      records.forEach(function(record) {
        // currentRecordName = record.get('Name');
        // clothingRecords[currentRecordName] = {'id': record.id, 'colorOptions': [], 'logoPrintOptions': [], 'textPrintOptions': []}
        clothingRecords[record.id] = {
          colorOptions: [],
          logoPrintOptions: [],
          textPrintOptions: [],
          amsPrice: record.get('AMS Price'),
          comPrice: record.get('COM Price')
        };

        let colorOptions = record.get('Color Options');
        colorOptions &&
          colorOptions.forEach(function(option) {
            clothingRecords[record.id]['colorOptions'].push(option);
          });

        logoPrintOptions = record.get('Logo Print Options');
        logoPrintOptions &&
          logoPrintOptions.forEach(function(option) {
            clothingBase('Logo Print').find(option, function(
              err,
              logoPrintRecord
            ) {
              if (err) {
                console.error(err);
                return;
              }
              clothingRecords[record.id]['logoPrintOptions'].push(
                logoPrintRecord.get('Name')
              );
            });
          });

        textPrintOptions = record.get('Text Print Options');
        textPrintOptions &&
          textPrintOptions.forEach(function(option) {
            clothingRecords[record.id]['textPrintOptions'].push(option);
          });
      });
    });
}

var margins = {},
  printCost = {},
  printExtraCosts = {},
  stitchCost = {},
  stitchExtraCosts = {};

function getAirtableCostData() {
  costBase('Margins')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        margins[record.get('Name')] = record.get('Margin');
      });
    });

  costBase('Printing Additional Charges')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        printExtraCosts[record.get('Name')] = record.get('Price');
      });
    });

  costBase('Stitching Additional Charges')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        stitchExtraCosts[record.get('Name')] = record.get('Price');
      });
    });

  //todo: printcosts and stitchcost
  costBase('Printing Charges')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        printCost[record.get('Order Quantity')] = {};
        for (x = 1; x < 7; x++) {
          printCost[record.get('Order Quantity')][x] = record.get(x.toString());
        }
      });
    });

  costBase('Stitching Charges')
    .select({
      view: 'Grid view'
    })
    .firstPage(function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function(record) {
        stitchCost[record.get('Order Quantity')] = {};
        for (x = 1999; x < 30000; x += 1000) {
          stitchCost[record.get('Order Quantity')][x] = record.get(
            x.toString()
          );
        }
      });
    });
}

//calling both to retrieve data when server loadas
getAirtableData();
getAirtableCostData();

//============================= express setup =============================
//setting up app (aka getting express, view engine, and static files good to go)
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//============================= All paths =============================
//Load webapp
app.get('/', (req, res) => {
  if (!process.env.NODE_ENV) {
    getAirtableData();
    getAirtableCostData();
  }

  production = process.env.NODE_ENV;

  res.render('index', {
    allRecords,
    clothingRecords,
    allColors,
    logoPrintOptions,
    production
  });
});

//admin page is to resync data
app.get('/admin', (req, res) => {
  getAirtableData();
  getAirtableCostData();
  res.send(
    '<h1>All Clothing Records</h1>' +
      JSON.stringify(allRecords) +
      '<h1>Clothing Defaults and ids</h1>' +
      JSON.stringify(clothingRecords) +
      '<h1>All Colors</h1>' +
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
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const nodemailer = require('nodemailer');
const nodemailerMailgun = require('nodemailer-mailgun-transport');

let transporter = nodemailer.createTransport(
  nodemailerMailgun({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  })
);

logoName = '';
textName = '';

app.post('/email', (req, res) => {
  const emailBody = `
            <h2>OTD App Order</h2>

            <hr/>

            <h4>Contact Details</h4>
            
            <ul>
                <li>Name: ${req.body.fullName}</li>
                <li>Email: ${req.body.email}</li>
                <li>Phone: ${req.body.phone}</li>
                <li>Club: ${req.body.org}</li>
                <li>Ratified Under: ${req.body.ratified}</li>
            </ul>

            <hr/>

            <h4>Order Details</h4>
            
            <P>General</P>
            <ul>
                <li>Quantity: ${req.body.quantity}</li>
                <li>Clothing: ${req.body.name}</li>
                <li>Notes: ${req.body.notes}</li>
            </ul>
           
            <p>Logo</p>
            <ul>
                <li># of Colors: ${req.body.logoColorNum}</li>
                <li>Transparency %: ${req.body.logoTransparency}</li>
                <li>Size: ${req.body.logoSize}</li>
                <li>Position: ${req.body.logoPosition}</li>
                <li>Stitch Count: ${req.body.logoStitchCount}</li>
            </ul>
            
            <p>Text</p>
            <ul>
                <li>Position: ${req.body.textPosition}</li>
            </ul>

            <hr/>

            <h4>Costing</h4>
            <ul>
                <li>Estimated Total: ${req.body.totalCost}</li>
                <li>Unit Clothing Cost: ${req.body.basePrice}</li>
                <li>Unit Logo Cost: ${req.body.printPrice}</li>
                <li>Unit Text Cost: ${req.body.textPrice}</li>
                <li>Setup Cost: ${req.body.setupCost}</li>
                <li>Setup Cost: ${req.body.margin}</li>
            </ul>
            `;

  const mailOptions = {
    from: '"OTD Custom Order App" <me@samples.mailgun.org>', // sender address
    to: 'otdstaff@gmail.com', // list of receivers
    subject: `Order From ${req.body.fullName} with ${req.body.org}`, // Subject line
    text: `Order From ${req.body.fullName} with ${req.body.org}`, // plain text body
    html: emailBody, // html body
    attachments: [
      {
        filename: req.body.org.concat('-', 'logo.png'),
        path: 'public/temp/uploads/'.concat(req.body.logoMulterFile)
      },
      {
        filename: req.body.org.concat('-', 'list.xlsx'),
        path: 'public/temp/uploads/'.concat(req.body.textMulterFile)
      }
    ]
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('submit');
    }
  });
});

//============================= attachments =============================
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'public/temp/uploads' });

app.post('/logoUpload', upload.single('logo'), (req, res) => {
  fs.rename(
    'public/temp/uploads/'.concat(req.file.filename),
    'public/temp/uploads/'.concat(req.body.ustring),
    function(err) {
      if (err) console.log('ERROR: ' + err);
    }
  );
  res.sendStatus(204);
});

app.post('/textUpload', upload.single('text'), (req, res) => {
  fs.rename(
    'public/temp/uploads/'.concat(req.file.filename),
    'public/temp/uploads/'.concat(req.body.ustring),
    function(err) {
      if (err) console.log('ERROR: ' + err);
    }
  );
  res.sendStatus(204);
});

if (!process.env.NODE_ENV) {
  app.listen(3000);
} else {
  app.listen(80);
}
