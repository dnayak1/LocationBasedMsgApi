var express    = require("express");
var login = require('./routes/loginroutes');
var message = require('./routes/messageroutes');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.post('/register',login.register);
router.post('/login',login.login);
router.post('/getUsers',login.getUsers);
router.post('/sendMessage',message.sendMessage);
router.post('/getMessages',message.getMessages);
router.post('/deleteMessages',message.deleteMessages);
router.post('/readMessages',message.readMessages);


app.use('/api', router);
app.listen(5000);
