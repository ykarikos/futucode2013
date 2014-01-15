var http = require("http");
var https = require("https");
var url = require("url");

exports.parseConf = function(env) {
	if (env.DATA_SOURCE == "") {
		console.error("DATA_SOURCE environment variable missing")
		process.exit(1)
	}
	var dataSource = url.parse(env.DATA_SOURCE);

	var module = http;
	if (dataSource.protocol == "https:") {
		module = https;
	}

	return {
		port: env.PORT || 9000, 
		module: module,
		dataSource: env.DATA_SOURCE, 
		authToken: env.AUTH_TOKEN 
	};
};

exports.configurationToOptions = function(conf) {
	var dataSource = url.parse(conf.dataSource);
	return {
		host: dataSource.hostname,
		path: dataSource.path,
		headers: { "Authorization" : "Bearer " + conf.authToken }
	};
};


