var express = require('express');
var app = express();

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
shirtNames =['gildan classic', 'gilden modern', 'gilden slim']


//Load webapp
app.get('/', (req, res) => {
    res.render('index');
});

//post submission from user to order table
app.post('/', (req, res) => {
    res.render('index');
});

//allow for data update
app.get('/admin', (req, res) => {
    res.send('admin page to update app to latest data', {shirtNames});
});



app.listen(3000); 

