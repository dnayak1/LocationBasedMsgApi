var dbconnection = require('../dbconnection');
var connection = dbconnection.connection;
var jwt = require('jsonwebtoken');
var message;

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

exports.register = function(req,res){
  var user = {
    "userName":req.body.userName,
    "password":req.body.password,
    "firstName":req.body.firstName,
    "lastName":req.body.lastName
  }
  connection.query('INSERT INTO User SET ?',user, function (error, results, fields){
    if (error) {
      console.log("error ocurred",error.code);
      if(error.code==="ER_DUP_ENTRY"){
        message = "UserName already exists";
        res.send({
          "code":400,
          "message":message
        });
      }else{
        message = "Invalid data. Try again"
        res.send({
          "code":400,
          "message":message
        })
      }
    }else{
      var token = jwt.sign(user, 'superSecret');
      message = "user registered sucessfully";
      res.send({
        "code":200,
        "message":message,
        "userName":user.userName,
        "token":token
          });
    }
  });
};

exports.login = function(req,res){
  var userName= req.body.userName;
  var password = req.body.password;

  connection.query('SELECT * FROM User WHERE UserName = ?',[userName], function (error, results, fields) {
  if (error) {
    message = "error occured";
    res.send({
      "code":400,
      "message":message
    })
  }else{
    console.log(results);
    if(results.length > 0){
      if(results[0].Password == password){
        var user = {
          "userName":results[0].UserName,
          "password":results[0].Password,
          "firstName":results[0].FirstName,
          "lastName":results[0].LastName
        };
        console.log(user);
        message = "login sucessfull";
        var token = jwt.sign(user, 'superSecret');
        res.send({
          "code":200,
          "message":message,
          "userName":user.userName,
          "token":token
            });
      }
      else{
        message = "UserName and password does not match";
        res.send({
          "code":400,
          "message":message
            });
      }
    }
    else{
      message="UserName does not exits";
      res.send({
        "code":400,
        "message":message
          });
    }
  }
  });
};
