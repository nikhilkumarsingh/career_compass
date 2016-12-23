
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var survey = require('./routes/survey');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/survey', survey);



app.use('/', express.static(__dirname + '/public_html'));
app.set('port',process.env.PORT || 3000);


app.listen(app.get('port'),function () {
    console.log("Server Started on port " + app.get('port'));
});




module.exports = app;

