var handler = require('../handler.js'),
	data = require('./data.json'),
	should = require('should'),
	assert = require('assert');


describe('handler.processData', function() {
	it('should process the data', function() {
		var expected = 
			{ 
				"children" : [
					{ "className" : "javascript", "value": 3},
					{ "className" : "java", "value": 2},
					{ "className" : "scala", "value": 2},
					{ "className" : "c#", "value": 1},
					{ "className" : "objective-c", "value": 1},
					{ "className" : "clojure", "value": 1}
				]
		};
		handler.processData(data).should.eql(expected)
	})
})