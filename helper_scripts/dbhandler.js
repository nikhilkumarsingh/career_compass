const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const assert = require('assert');
const url = "mongodb://career_compass:career_compass@ds145128.mlab.com:45128/career_compass";
function  login(obj, callback) {

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        var handler = db.collection('documents');

        handler.find({'username':obj.username}).toArray(function (err,result) {
            assert.equal(err,null);
            if(result.length == 0)
            {
                db.close();
                callback(0);
            }

            else
            {
                if(obj.password === result[0].password)
                {
                    db.close();
                    callback(1);
                }
                else
                {
                    db.close();
                    callback(0);
                }
            }
        });
    });

}

function check_user(obj,callback)
{

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        var handler = db.collection('documents');
        handler.find({'username':obj.username}).toArray(function (err,result) {
            assert.equal(err,null);
            if(result.length)
            {
                db.close();
                callback(1);
            }

            else
            {
                db.close();
                callback(0);
            }
        });
    });
}
function new_user(obj,callback)
{

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('documents');

        handler.find({'username':obj.username}).toArray(function (err,result) {

            assert.equal(err,null);
            if(result.length)
            {
                db.close();
                callback(0);
            }

            else
            {
                handler.insertOne(
                    {
                        'username':obj.username,
                        'password':obj.password,
                        'phone' : obj.phone,
                        'email' : obj.email,
                        'age' : obj.age,
                        'address':obj.address

                    },function (err,result) {

                        assert.equal(err,null);
                        db.close();
                        callback(1);
                    }
                )
            }
        });
    });
}

function fetchUser(username, callback) {

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);

        var handler = db.collection('documents');

        handler.find({'username': username}).toArray(function (err,result) {

            if (err)
            {
                throw  err;
            }

            if(result.length == 0)
            {
                throw  err;
            }
            callback(result);
            db.close();


        });
    });
}
function updateInfo(obj, callback) {

    mongoClient.connect(url, function (err, db)
    {
        //// console.log("Inside Update Info");
        //// console.log(obj);
        assert.equal(err,null);
        var handler = db.collection('documents');

        handler.find({'username' : obj.l_username}).toArray(function (err, result) {

            //// console.log("Result of finding query of update info");
            //// console.log(result);
            obj['password'] = result[0].password;

            handler.deleteOne({username : obj.l_username}, function (err, result) {

                if (err)
                {
                    //// console.log(err);
                }


                handler.insertOne({
                    'username':obj.username,
                    'password':obj.password,
                    'phone' : obj.phone,
                    'email' : obj.email,
                    'age' : obj.age,
                    'address':obj.address

                },function (err, result) {

                    if (err)
                    {
                        //// console.log(err);
                    }

                    db.close();
                    callback(true);



                });

            });


        });
    });
}


function deleteAll() {

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        var handler = db.collection('documents');
        handler.deleteMany({}, function (err, result) {

        });
    });



}

function UpdatePassword(obj, callback)
{

    mongoClient.connect(url, function (err, db)
    {
        assert.equal(err,null);
        var handler = db.collection('documents');

        handler.find({'username' : obj.username}).toArray(function (err, result) {

            if(obj.pass1!=result[0].password)
            {
                //// console.log("Update Password Sending Value Zero");
                callback(0);
                db.close();
                return;
            }
            // obj['password'] = result[0].password;
            obj['age'] = result[0].age;
            obj['email'] = result[0].email;
            obj['phone'] = result[0].phone;
            obj['address']=result[0].address;
            handler.deleteMany({username : obj.username}, function (err, result) {

                if (err)
                {
                    //// console.log(err);
                }
                handler.insertOne({
                    'username':obj.username,
                    'password':obj.pass2,
                    'phone' : obj.phone,
                    'email' : obj.email,
                    'age' : obj.age,
                    'address':obj.address
                },function (err, result) {

                    if (err)
                    {
                        //// console.log(err);
                    }

                    db.close();
                    callback(1);
                });

            });


        });
    });

}
module.exports = {
    check_user: check_user,
    new_user : new_user,
    fetchUser : fetchUser,
    deleteAll : deleteAll,
    updateInfo : updateInfo,
    updatePassword : UpdatePassword,
    login : login
};

