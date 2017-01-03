/**
 * Created by himanshu on 23/12/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('survey', {  });
});

module.exports = router;