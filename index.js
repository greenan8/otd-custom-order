var express = require('express');
var app = express();


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/admin', (req, res) => {
    res.send('admin page to update app to latest data');
});



app.listen(3000); 

