var http = require("http");
var url = require("url");
var handler = require("./handler.js");
var util = require("./util.js");

function onRequest(request, response) {
	console.log("Request to " + request.url + " received.");
	var parsedUrl = url.parse(request.url, true);
	if (parsedUrl.pathname == "/data.json") {
		handler.dataJson(configuration, dataRequestOptions, response);
	} else {
		handler.notFound(response);
	}
}

var configuration = util.parseConf(process.env);
var dataRequestOptions = util.configurationToOptions(configuration);
// console.log("Read configuration: " + JSON.stringify(configuration));

http.createServer(onRequest).listen(configuration.port);

console.log("Server has started: http://localhost:" + configuration.port);

