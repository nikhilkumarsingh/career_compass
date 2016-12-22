/**
 * Created by himanshu on 22/12/16.
 */

var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/public_html'));
app.set('port',process.env.PORT || 3000);

app.listen(app.get('port'),function () {
    console.log("Server Started");
});

