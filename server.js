var http = require("http");
var url = require("url");
var _ = require("underscore");

var dataSource = "http://localhost:8000/data.json";
var cachePeriod = 5; // 5 sec
var cache = {
	valid: 0,
	data: {}
};

function currentTimeInSeconds() {
	return new Date().getTime() / 1000;
}

function updateCache(data) {
	cache.valid = currentTimeInSeconds() + cachePeriod;
	cache.data = data;
}

function data(response) {

	var processData = function(data) {
		var messages = data.messages.filter(function(msg){
			return msg.replied_to_id != null
		}).map(function(msg) {
			return msg.body.parsed.toLowerCase();
		});

		var languages = _.flatten(messages.map(function(msg) { 
			return msg.split(/\s*,\s*/); 
		}));

		return _.map(_.countBy(languages, _.identity), function(value, key) {
			return [key, value];
		});
	}
	var requestCallback = function(wsRes) {
		var str = "";
		//another chunk of data has been recieved, so append it to `str`
		wsRes.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		wsRes.on('end', function () {
			var newData = JSON.stringify(processData(JSON.parse(str)));
			writeResponse(newData);
			updateCache(newData);
		});
	}

	function writeResponse(data) {
		response.writeHead(200, {"Content-Type": "application/json"});
		response.write(data);
		response.end();
	}

	if (cache.valid < currentTimeInSeconds()) {
		console.log("cache miss");
		http.get(dataSource, requestCallback);
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

http.createServer(onRequest).listen(8888);

console.log("Server has started.");