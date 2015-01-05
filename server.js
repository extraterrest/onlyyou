var http = require("http");
var url = require("url");
var querystring = require("querystring");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
	var query = url.parse(request.url).query;
	console.log("Request for" + pathname + "received.");
	console.log("page generating.");
	route(handle, pathname, response, query);
  }
  http.createServer(onRequest).listen(12306);
  console.log("Server has started.");
}

exports.start = start;