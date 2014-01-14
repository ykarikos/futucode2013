var http = require("http");
var https = require("https");
var url = require("url");

exports.parseArgs = function(args) {
	var confArgs = args.slice(2);
	if (confArgs.length < 3) {
		console.log("Usage: " + args.slice(0,2).join(" ") +  " port dataSource authToken");
		process.exit(1);
	}
	return {port: confArgs[0], dataSource: confArgs[1], authToken: confArgs[2] };
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


