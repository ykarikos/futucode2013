var http = require("http");
var url = require("url");
var handler = require("./handler.js");
var util = require("./util.js");

function onRequest(request, response) {
	console.log("Request to " + request.url + " received.");
	var parsedUrl = url.parse(request.url, true);
	if (parsedUrl.pathname == "/data.json") {
		handler.dataJson(dataRequestOptions, response);
	} else {
		handler.notFound(response);
	}
}

var configuration = util.parseArgs(process.argv);
var dataRequestOptions = util.configurationToOptions(configuration);
// console.log("Read configuration: " + JSON.stringify(dataRequestOptions));

var port = process.env.PORT || 5000;
http.createServer(onRequest).listen(port);

console.log("Server has started: http://localhost:" + port);

