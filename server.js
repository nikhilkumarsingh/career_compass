
var express = require('express');
var path = require('path');
const md5 = require('md5');
const dbhandler = require('./dbhandler');
const bodyParser = require('body-parser');
const cheerio= require('cheerio');
var survey = require('./routes/survey');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public_html')));
app.post('/login',function (req, res) {

    dbhandler.login({
        username : req.body.username,
        password : md5(req.body.password)
    }, function (value) {
        if (value == 1)
        {
            res.send({val : 1});
        }
        else
        {
            res.send({val : 0});
        }

    });

});

app.post('/checkuser',function (req,res) {

    var obj ={
        username:req.body.name,
        password:md5(req.body.pswd)
    };

    dbhandler.check_user(obj,function (result) {

        if(result==1)
            res.send(1);
        else
            res.send(0);
    });
});


app.post('/newuser',function (req,res) {

    var obj ={
        username:req.body.name,
        password:md5(req.body.pswd),
        phone : req.body.phone,
        email : req.body.email,
        age : req.body.age,
        address: req.body.address
    };

    dbhandler.new_user(obj,function (result) {

        if(result==0)
            res.send("no");
        else
            res.send("yes");
    });

});

app.post('/fetchUser', function (req,res) {
    dbhandler.fetchUser(req.body.username, function (result) {
        res.send(result);

    });

});

app.post('/delete', function (req, res) {

    dbhandler.deleteAll();
    res.send({val : 1});

});

app.post('/updateInfo', function (req, res) {

    if(req.body.l_username!= req.body.username)
    {
        dbhandler.check_user({username : req.body.username}, function (result) {

            if(result == 1)
            {
                res.send({result : 0});
                return;
            }
            dbhandler.updateInfo({

                l_username : req.body.l_username,
                username: req.body.username,
                phone: req.body.phone,
                email: req.body.email,
                age: req.body.age,
                address:req.body.address

            }, function (b) {

                if (b) {
                    res.send({result: 1});
                }
                else {
                    res.send({result: 2});
                }

            });

        });
    }
    else
    {
        dbhandler.updateInfo({

            l_username : req.body.l_username,
            username: req.body.username,
            // password:md5(req.body.pswd),
            phone: req.body.phone,
            email: req.body.email,
            age: req.body.age,
            address:req.body.address

        }, function (b) {


            if (b) {
                res.send({result: 1});
            }
            else {
                res.send({result: 2});
            }

        });
    }


});

app.post('/updatePassword',function (req, res) {

    dbhandler.updatePassword({
        pass1 : md5(req.body.password),
        pass2 : md5(req.body.n_password),
        username : req.body.username
    }, function (bool) {
        res.send({val : bool});

    })
});

app.use('/survey', survey);



app.use('/', express.static(__dirname + '/public_html'));
app.set('port',process.env.PORT || 5000);


app.listen(app.get('port'),function () {
    console.log("Server Started on port " + app.get('port'));
});


module.exports = app;

