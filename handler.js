var url = require("url");
var _ = require("underscore");

var cachePeriod = 20; // 20 sec
var cache = {
	valid: 0,
	data: ""
};

var updateCache = function(data) {
	cache.valid = currentTimeInSeconds() + cachePeriod;
	cache.data = data;
}

var currentTimeInSeconds = function() {
	return new Date().getTime() / 1000;
}

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
exports.processData = processData;

exports.dataJson = function(dataRequestOptions, response) {

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

	var writeResponse = function(data) {
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
};

exports.notFound = function(response) {
	response.writeHead(404, {"Content-Type": "text/plain"});
	response.write("404 Not found\nGo away");
	response.end();		
};
