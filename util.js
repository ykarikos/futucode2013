var http = require("http");
var https = require("https");
var url = require("url");

exports.parseArgs = function(args) {
	var confArgs = args.slice(2);
	if (confArgs.length < 2) {
		console.log("Usage: " + args.slice(0,2).join(" ") +  " dataSource authToken");
		process.exit(1);
	}
	return {dataSource: confArgs[0], authToken: confArgs[1] };
};

exports.configurationToOptions = function(conf) {
	var parsed = url.parse(conf.dataSource);
	var module = http;
	if (parsed.protocol == "https:") {
		module = https;
	}
	return {
		host: parsed.hostname,
		module: module,
		path: parsed.path,
		port: parsed.port,
		headers: { "Authorization" : "Bearer " + conf.authToken }
	};
};


