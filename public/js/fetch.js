//==================== fetching data from backend ====================
var allrecord, allColors, clothingRecords, allPrintOptions;
var margins, printCost, printExtraCosts, stitchCost, stitchExtaCosts;

fetch("/allRecords")
.then(response => {
    response.json().then(json => {
        allRecords = json;   
    })
})

fetch("/allColors")
.then(response => {
    response.json().then(json => {
        allColors = json;   
    })
})

fetch("/clothingRecords")
.then(response => {
    response.json().then(json => {
        clothingRecords = json;   
    })
})

fetch("/margins")
.then(response => {
    response.json().then(json => {
        margins = json;   
    })
})

fetch("/printCost")
.then(response => {
    response.json().then(json => {
        printCost = json;   
    })
})

fetch("/printExtraCosts")
.then(response => {
    response.json().then(json => {
        printExtraCosts = json;   
    })
})

fetch("/stitchCost")
.then(response => {
    response.json().then(json => {
        stitchCost = json;   
    })
})

fetch("/stitchExtraCosts")
.then(response => {
    response.json().then(json => {
        stitchExtraCosts = json;   
    })
})
