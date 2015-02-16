var sqlite3 = require('sqlite3').verbose();
var querystring = require("querystring");
var async = require("async");

function rfpgen(res,query) {
  info = dataFormatPost(query);
  var db = new sqlite3.Database('./rfx.sqlite3');

  async.parallel([
    function(callback) {
	  db.all("select item, content, comment from entries where (platform='" + info[0] +"' and category='hardware' and modulecode&" + info[1] + ")", function (err, res) {
 	    callback(null, res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, comment from entries where (category='system' and modulecode&"+info[1] + ")", function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, comment from entries where category='adc' and modulecode&" + info[1], function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, comment from entries where category='security' and modulecode&" + info[1], function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, comment from entries where category='admin' and modulecode&" + info[1], function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, comment from entries where category='service'", function(err, res) {
		callback(null,res);
      });
	}
  ],	
	function(err, results){
        console.log(info);
		var data = {
            hardwareModule: dataFormatBack(info)[0],
            softwareModule: dataFormatBack(info)[1],
			tablePerformance: results[0],
			tableSystem: results[1],
			tableADC: results[2],
			tableSecurity: results[3],
			tableAdmin: results[4],
			tableService: results[5]
		};
        res.render('rfpgen',data);
	    db.close();
	}
  );
}

function dataFormatPost(query) {
    var platform = query["platform"];
    var blade = query["blade"];
    if (platform.indexOf('VIPRION') > -1) platform = platform + blade;
    module = query["module"];
    var modulecode = 0;
    if (module.indexOf('afm') > -1) modulecode = modulecode + 64;
    if (module.indexOf('asm') > -1) modulecode = modulecode + 32;
    if (module.indexOf('apm') > -1) modulecode = modulecode + 16;
    if (module.indexOf('lc')  > -1) modulecode = modulecode + 8;
    if (module.indexOf('aam') > -1) modulecode = modulecode + 4;
    if (module.indexOf('dns') > -1) modulecode = modulecode + 2;
    if (module.indexOf('ltm') > -1) modulecode = modulecode + 1;
    return [platform, modulecode];
}

function dataFormatBack (code) {
    var output = [];
    output[0] = code[0];
    output[1] = [];
    if (code[0].indexOf('VIPRION')>-1) output[0] = code[0].split("B")[0] + " + B" + code[0].split("B")[1];
    else output[0] = "BIGIP " + code[0];
    if (code[1] & 1) output[1].push("ltm");
    if (code[1] & 2) output[1].push("dns");
    if (code[1] & 4) output[1].push("aam");
    if (code[1] & 8) output[1].push("lc");
    if (code[1] & 16) output[1].push("apm");
    if (code[1] & 32) output[1].push("asm");
    if (code[1] & 64) output[1].push("afm");
    if (code[1] & 128) output[1].push("pem");
    console.log(output);
    return output;
}

function deviationgen(res,query) {
  info = dataFormatPost(query);
  var db = new sqlite3.Database('./rfx.sqlite3');
  async.parallel([
    function(callback) {
	  db.all("select item, content, deviation, response from entries where (platform='" + info[0] +"' and category='hardware' and modulecode&" + info[1] + ")", function (err, res) {
 	    callback(null, res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, deviation, response from entries where (category='system' and modulecode&"+info[1] + ")", function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, deviation, response from entries where category='adc' and modulecode&" + info[1], function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, deviation, response from entries where category='security' and modulecode&" + info[1], function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, deviation, response from entries where category='admin' and modulecode&" + info[1], function(err, res) {
		callback(null,res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, deviation, response from entries where category='service'", function(err, res) {
		callback(null,res);
      });
	}
  ],	
	function(err, results){
		var data = {
			hardwareModule: dataFormatBack(info)[0],
			softwareModule: dataFormatBack(info)[1],
			tablePerformance: results[0],
			tableSystem: results[1],
			tableADC: results[2],
			tableSecurity: results[3],
			tableAdmin: results[4],
			tableService: results[5]
		};
        res.render('deviationgen',data);
	    db.close();
	}
  );
}

exports.rfpgen = rfpgen;
exports.deviationgen = deviationgen;

