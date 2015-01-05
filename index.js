var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.index;
handle["/rfpgen"] = requestHandlers.rfpgen;
handle["/deviationgen"] = requestHandlers.deviationgen;
handle["/global.css"] = requestHandlers.css;

server.start(router.route, handle);