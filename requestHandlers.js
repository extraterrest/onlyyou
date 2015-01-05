var exec = require("child_process").exec;
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var querystring = require("querystring");
var async = require("async");

function rfpgen(response,query) {
  info = dataformat(query);
  var db = new sqlite3.Database('./rfx.sqlite3');
  response.writeHead(200, {"Content-Type":"text/html"});

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
	  writefullpage(response, results);
	  db.close();
	}
  );
}

function writefullpage(response, data) {
  response.write('<head><meta charset="UTF-8"><link rel="stylesheet" href="./global.css"></head>');
  response.write("<body><div align=center valign=middle>");
  response.write("<H3>Platform: " + info[0] + " 参数指标</H3><BR>");
  response.write('<table class="rfp">');
  response.write('<tr><th class="col1">指标项</th><th class="col2">要求</th><th class="col3">备注</th></tr>');
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

function devpage(response, data) {
  response.write('<head><meta charset="UTF-8"><link rel="stylesheet" href="./global.css"></head>');
  response.write("<body><div align=center valign=middle>");
  response.write("<H3>Platform: " + info[0] + " 投标偏离表</H3><BR>");
  response.write('<table class="dev">');
  response.write('<tr><th class="col1">指标项</th><th class="col2">要求</th><th class="col3">偏离应答</th><th class="col4">具体应答</th></tr>');
  response.write('<tr><td colspan="4">性能参数</td></tr>');
  devwrite(response, data[0]);
  response.write('<tr><td colspan="4">系统要求</td></tr>');
  devwrite(response, data[1]);
  response.write('<tr><td colspan="4">应用交付要求</td></tr>');
  devwrite(response, data[2]);
  response.write('<tr><td colspan="4">安全要求</td></tr>');
  devwrite(response, data[3]);
  response.write('<tr><td colspan="4">管理要求</td></tr>');
  devwrite(response, data[4]);
  response.write('<tr><td colspan="4">服务要求</td></tr>');
  devwrite(response, data[5]);
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


function pagewrite(response, content) {
  console.log("StartWritePage" + content[0]);
  content.forEach(function(line){
  	response.write("<tr><td>" + line.item + "</td><td>" + line.content + "</td><td>" + line.comment + "</td></tr>");
	//console.log(line);})
  })
}

function devwrite(response, content) {
  console.log("StartWritePage" + content[0]);
  content.forEach(function(line){
  	response.write("<tr><td>" + line.item + "</td><td>" + line.content + "</td><td>" + line.deviation + "</td><td>" + line.response + "</td></tr>");
	//console.log(line);})
  })
}

function deviationgen(response,query) {
  info = dataformat(query);
  var db = new sqlite3.Database('./rfx.sqlite3');
  response.writeHead(200, {"Content-Type":"text/html"});
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
	  devpage(response, results);
	  db.close();
	}
  );
}

function css(response) {
  console.log("Request handler 'css' was called.");
  fs.readFile('./global.css', function (err, data) {
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

exports.rfpgen = rfpgen;
exports.deviationgen = deviationgen;
exports.index = index;
exports.css = css;

