var http = require("http");
var https = require("https");
var url = require("url");
var _ = require("underscore");

var cachePeriod = 20; // 20 sec
var cache = {
	valid: 0,
	data: ""
};


function parseArgs(args) {
	var confArgs = args.slice(2);
	if (confArgs.length < 3) {
		console.log("Usage: " + args.slice(0,2).join(" ") +  " port dataSource authToken");
		process.exit(1);
	}
	return {port: confArgs[0], dataSource: confArgs[1], authToken: confArgs[2] };
}

function currentTimeInSeconds() {
	return new Date().getTime() / 1000;
}

function updateCache(data) {
	cache.valid = currentTimeInSeconds() + cachePeriod;
	cache.data = data;
}

function data(response) {

	var processData = function(data) {
		var messages = _.uniq(_.sortBy(data.messages.filter(function(msg) {
			return msg.replied_to_id != null
		}), function(msg) { // sortBy iterator
			return msg.created_at;
		}).reverse(), function(msg) { // uniq iterator
			return msg.sender_id;
		}).map(function(msg) {
			return msg.body.parsed.toLowerCase();
		});

		var languages = _.flatten(messages.map(function(msg) { 
			return msg.split(/\s*,\s*/); 
		}));

		return _.map(_.countBy(languages, _.identity), function(value, key) {
			return [key, value];
		});
	};

	var requestCallback = function(wsRes) {
		var str = "";
		//another chunk of data has been recieved, so append it to `str`
		wsRes.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been received, so we just print it out here
		wsRes.on('end', function () {
			if (str == "") {
				errorCallback("Empty data.");
			} else {
				var newData = JSON.stringify(processData(JSON.parse(str)));
				updateCache(newData);
				writeResponse(newData);
			}
		});
	};

	var errorCallback = function(e) {
		console.error(e);
		writeResponse(cache.data);
	};

	function writeResponse(data) {
		if (data == "") {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write("500 Internal Server Error\nEmpty data")
		} else {
			response.writeHead(200, {"Content-Type": "application/json"});
			response.write(data);
		}
		response.end();
	}

	if (cache.valid < currentTimeInSeconds()) {
		console.log("cache miss");
		dataRequestOptions.module.get(dataRequestOptions, requestCallback).on('error', errorCallback);
	} else {
		console.log("cache hit");
		writeResponse(cache.data);
	}
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

function configurationToOptions(conf) {
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
}

var configuration = parseArgs(process.argv);
var dataRequestOptions = configurationToOptions(configuration);
// console.log("Read configuration: " + JSON.stringify(dataRequestOptions));

http.createServer(onRequest).listen(configuration.port);

console.log("Server has started: http://localhost:" + configuration.port);

