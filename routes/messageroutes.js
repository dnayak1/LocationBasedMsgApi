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

exports.sendMessage = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        var msg = {
          "sender":req.body.sender,
          "receiver":req.body.receiver,
          "message":req.body.message,
          "region":req.body.region
        }
        connection.query('INSERT INTO Message SET ?',msg, function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Invalid data. Try again"
            res.send({
              "code":400,
              "message":message
            })
          }else{
            message = "message sent";
            res.send({
              "code":200,
              "message":message,
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.getMessages = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var userName=req.body.userName;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        connection.query('select u.FirstName,u.LastName,m.messageId,m.Sender,m.Message,m.isRead,m.isLocked,m.Date,m.Region from Message m inner join User u on u.UserName=m.Sender where m.Receiver=?',userName, function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Fetchning message failed"
            res.send({
              "code":400,
              "message":message
            });
          }else{
            message = "success";
            res.send({
              "code":200,
              "message":message,
              "result":results
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};


exports.deleteMessages = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // var userName=req.body.userName;
  // var sender=req.body.sender;
  // var region=req.body.region;
  var messageId=req.body.messageId;

  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        connection.query('delete from Message where messageId=?',[messageId], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Deleting message failed"
            res.send({
              "code":400,
              "message":message
            });
          }else{
            message = "success";
            res.send({
              "code":200,
              "message":message,
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};


exports.readMessages = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var messageId=req.body.messageId;

  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        connection.query('update Message set isRead=1 where messageId=?',[messageId], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Deleting message failed"
            res.send({
              "code":400,
              "message":message
            });
          }else{
            message = "success";
            res.send({
              "code":200,
              "message":message,
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};

exports.unlockMessages = function(req,res){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var receiver = req.body.receiver;
  var region = req.body.region;
  if(token){
    jwt.verify(token, 'superSecret', function(err, decoded) {
      if (err) {
        message="Failed to authenticate token."
        res.send({
          "code": "200",
          "message": message
        });
      }else{
        console.log('Querying the database..for receiver' +receiver+'and region = '+region);
        connection.query('update Message set isLocked=0 where receiver=? AND region = ?',[receiver,region], function (error, results, fields){
          if (error) {
            console.log("error ocurred",error.code);
            message = "Deleting message failed"
            res.send({
              "code":400,
              "message":message
            });
          }else{
            message = "success";
            res.send({
              "code":200,
              "message":results,
                });
          }
        });
      }
    });
  }else{
    message="Invalid token";
    res.send({
      "code":400,
      "message":message
    });
  }
};
