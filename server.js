var http = require("http");
var url = require("url");

var dataSource = "http://localhost:8000/data.json";

function data(response) {
	var mangleData = function(data) {
		return data;
	}
	var requestCallback = function(wsRes) {
		var str = "";
		//another chunk of data has been recieved, so append it to `str`
		wsRes.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		wsRes.on('end', function () {
			var newData = JSON.stringify(mangleData(JSON.parse(str)));
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(newData);
			response.end();
		});		
	}

	http.get(dataSource, requestCallback);
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