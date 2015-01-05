function route(handle, pathname, response, query ) {
  console.log("About to route a request for " + pathname + query);
  if (typeof handle[pathname] === 'function' ) {
    handle[pathname](response, query);
  } else {
    console.log("No request handler found for" + pathname);
	response.writeHead (404, {"Content-Type": "text/plain"});
	response.write("404 Not found");
	response.end();
  }
}

exports.route = route;