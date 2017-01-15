var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var userSchema = mongoose.Schema({

        first_name   : String,
        last_name     : String,
        email        : String,
        password     : String,
        age          : Number,
        complete   : Boolean,
        address    : String,

    google           : {
        id           : String,
        token        : String,
        email         : String

    }

});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);