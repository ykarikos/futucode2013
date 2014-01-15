var handler = require("./handler.js");
var util = require("./util.js");
var express = require("express");
var app = express();

function onRequest(request, response) {
	handler.dataJson(configuration, dataRequestOptions, response);
}

var configuration = util.parseConf(process.env);
var dataRequestOptions = util.configurationToOptions(configuration);
// console.log("Read configuration: " + JSON.stringify(configuration));

app.get('/data.json', onRequest);
app.listen(configuration.port);

console.log("Server has started: http://localhost:" + configuration.port);

