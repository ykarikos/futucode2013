var url = require("url");
var _ = require("underscore");

var cachePeriod = 60; // sec
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
	var messages = _.chain(data).filter(function(msg) {
		return msg.replied_to_id != null
	}).sortBy(function(msg) {
		return msg.created_at;
	}).reverse().uniq(function(msg) {
		return msg.sender_id;
	}).map(function(msg) {
		return msg.body.parsed.toLowerCase();
	}).value();

	var languages = _.chain(messages).map(function(msg) { 
		return _.uniq(msg.split(/\s*,\s*/));
	}).flatten().filter(function(lang) { 
		return lang != ""; 
	}).value();

	var children = _.chain(languages)
	.countBy(_.identity)
	.map(function(value, key) {
		return { className: key, value: value };
	}).sortBy(function(obj) {
    	return obj.value;
    }).reverse().value();

	return { 
		children: children,
		messagesCount: messages.length,
		languagesCount: children.length,
		languagesPerMessage: Math.round(languages.length / messages.length * 10) / 10
	};
};
exports.processData = processData;

exports.dataJson = function(configuration, dataRequestOptions, res) {
	var messages = Array();

	var last = function(arr) {
		return arr[arr.length - 1];
	}

	var requestCallback = function(wsRes) {
		var str = "";
		//another chunk of data has been received, so append it to `str`
		wsRes.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been received, so we just print it out here
		wsRes.on('end', function () {
			try {
				var data = JSON.parse(str);
				messages = messages.concat(data.messages);
				if (data.meta.older_available) {
					var options = _.clone(dataRequestOptions);
					options.path = options.path + "?older_than=" + last(messages).id;
					configuration.module.get(options, requestCallback).on('error', errorCallback);
				} else {
					var newData = JSON.stringify(processData(messages));
					updateCache(newData);
					writeResponse(newData);
				}
			} catch (e) {
				errorCallback(e);
			}
		});
	};

	var errorCallback = function(e) {
		console.error(e);
		writeResponse(cache.data);
	};

	var writeResponse = function(data) {
		if (data == "") {
			res.status(500);
			res.set("Content-Type", "text/plain");
			res.send("500 Internal Server Error\nEmpty data")
		} else {
			res.status(200);
			res.set("Content-Type", "application/json");
			res.send(data);
		}
		res.end();
	}

	if (cache.valid < currentTimeInSeconds()) {
		console.log("cache miss");
		configuration.module.get(dataRequestOptions, requestCallback).on('error', errorCallback);
	} else {
		// console.log("cache hit");
		writeResponse(cache.data);
	}
};

