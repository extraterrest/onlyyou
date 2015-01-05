var exec = require("child_process").exec;
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var querystring = require("querystring");
var async = require("async");

function rfpgen(response,query) {
  info = dataformat(query);
  var db = new sqlite3.Database('./REF.sqlite3');
  response.writeHead(200, {"Content-Type":"text/html"});

  async.parallel([
    function(callback) {
	  db.all("select item, content, comment from entries where (platform='" + info[0] +"' and category='hardware' and modulecode&" + info[1] + ")", function (err, res) {
 	    callback(null, res);
      });
	},
	
	function(callback) {
	  db.all("select item, content, comment from entries where category='system' and modulecode&"+info[1], function(err, res) {
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
	  writefullpage(response, results);
	  db.close();
	}
  );
}

function writefullpage(response, data) {
  response.write('<head><meta charset="UTF-8"><style>table, th, td {border: 1px solid black;border-collapse: collapse;} th, td {padding: 5px;}</style></head>');
  response.write("<body><div align=center valign=middle>");
  response.write("<H3>Platform: " + info[0] + " 参数指标</H3><BR>");
  response.write('<table border=\"1\" width="500">');
  response.write('<tr><th align="center">指标项</th><th align="center">要求</th><th align="center">备注</th></tr>');
  response.write('<tr><td colspan="3">性能参数</td></tr>');
  pagewrite(response, data[0]);
  response.write('<tr><td colspan="3">系统要求</td></tr>');
  pagewrite(response, data[1]);
  response.write('<tr><td colspan="3">应用交付要求</td></tr>');
  pagewrite(response, data[2]);
  response.write('<tr><td colspan="3">安全要求</td></tr>');
  pagewrite(response, data[3]);
  response.write('<tr><td colspan="3">管理要求</td></tr>');
  pagewrite(response, data[4]);
  response.write('<tr><td colspan="3">服务要求</td></tr>');
  pagewrite(response, data[5]);
  response.write('</table>');
  response.write('</div></body>');
  response.end();
}

function index(response) {
  console.log("Request handler 'index' was called.");
  fs.readFile('./index.html', function (err, data) {
    response.writeHead(200, {"Content-Type":"text/html"});
	if (err) {
	  console.err(err);
	  response.write("File Read Err");
	  response.end();	  
	} else {
	  response.write(data);
	  response.end();
	}
  });
}

function dataformat(query) {
  platform = querystring.parse(query)["platform"];
  module = querystring.parse(query)["module"];
  var adcmodule = [];
  var secmodule = [];
  var modulecode = 0;
  if (typeof module != 'object') 
    var module = new Array (module);
  module.unshift('tmos');
  module.forEach( function(eachmodule) {
    if ( ['tmos', 'ltm', 'dns', 'lc', 'dnss','aam'].indexOf(eachmodule) > -1)
      adcmodule.push(eachmodule);
    if ( ['afm', 'asm', 'apm', 'apml'].indexOf(eachmodule) > -1)
      secmodule.push(eachmodule);
	})
  if (! (secmodule.indexOf("apm") > -1)) {
    secmodule.push("apml")
  }
  secmodule.push("general");
  if ((adcmodule.indexOf("dns") > -1) || (adcmodule.indexOf("ltm") > -1)) {
    adcmodule.push("dnss")
  }
  if (module.indexOf('afm') > -1) modulecode = modulecode + 64;
  if (module.indexOf('asm') > -1) modulecode = modulecode + 32;
  if (module.indexOf('apm') > -1) modulecode = modulecode + 16;
  if (module.indexOf('lc')  > -1) modulecode = modulecode + 8;
  if (module.indexOf('aam') > -1) modulecode = modulecode + 4;
  if (module.indexOf('dns') > -1) modulecode = modulecode + 2;
  if (module.indexOf('ltm') > -1) modulecode = modulecode + 1;
  return [platform, modulecode];
} 


function pagewrite(response, content) {
  console.log("StartWritePage" + content[0]);
  content.forEach(function(line){
  	response.write("<tr><td>" + line.item + "</td><td>" + line.content + "</td><td>" + line.comment + "</td></tr>");
	//console.log(line);})
}

exports.rfpgen = rfpgen;
exports.index = index;

