var http = require("http");
var url = require("url");

function data(response) {
	response.writeHead(200, {"Content-Type": "application/json"});
	var o = { data: 'foo', index: 2 };
	response.write(JSON.stringify(o));
	response.end();	
}

function notFound(response) {
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.write("404 Not found\nGo away");
	response.end();		
}

function onRequest(request, response) {
	console.log("Request to " + request.url + " received.");
	var parsedUrl = url.parse(request.url, true);
	if (parsedUrl.pathname == "/data.json") {
		data(response);
	} else {
		notFound(response);
	}
}

http.createServer(onRequest).listen(8888);

console.log("Server has started.");