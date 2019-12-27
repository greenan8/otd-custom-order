/* global orderDetails */

// ==================== fetching data from backend ====================
// eslint-disable-next-line no-unused-vars
let allRecords;
// eslint-disable-next-line no-unused-vars
let allColors;
// eslint-disable-next-line no-unused-vars
let clothingRecords;
// eslint-disable-next-line no-unused-vars
let margins;
// eslint-disable-next-line no-unused-vars
let printCost;
// eslint-disable-next-line no-unused-vars
let printExtraCosts;
// eslint-disable-next-line no-unused-vars
let stitchCost;
// eslint-disable-next-line no-unused-vars
let stitchExtraCosts;

fetch('/allRecords').then(response => {
  response.json().then(json => {
    allRecords = json;
  });
});

fetch('/allColors').then(response => {
  response.json().then(json => {
    allColors = json;
  });
});

fetch('/clothingRecords').then(response => {
  response.json().then(json => {
    clothingRecords = json;
  });
});

fetch('/margins').then(response => {
  response.json().then(json => {
    margins = json;
  });
});

fetch('/printCost').then(response => {
  response.json().then(json => {
    printCost = json;
  });
});

fetch('/printExtraCosts').then(response => {
  response.json().then(json => {
    printExtraCosts = json;
  });
});

fetch('/stitchCost').then(response => {
  response.json().then(json => {
    stitchCost = json;
  });
});

fetch('/stitchExtraCosts').then(response => {
  response.json().then(json => {
    stitchExtraCosts = json;
  });
});
