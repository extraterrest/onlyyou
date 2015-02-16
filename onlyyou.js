var requestHandlers = require("./requestHandlers");
var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
var url = require("url");
var querystring = require("querystring");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 80);

app.use(express.static(__dirname + '/public'));

app.get('/home', function(req,res) {
	res.render('home');
});

app.post('/rfpgen', function(req,res) {
    var query = req.body;
	requestHandlers.rfpgen(res, query);
});

app.post('/deviationgen', function(req,res) {
    var query = req.body;
    requestHandlers.deviationgen(res, query);
});

app.get('/', function(req,res) {
	res.render('rfp');
});

app.use(function(req, res ){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrol-C to terminate.');
}); 
