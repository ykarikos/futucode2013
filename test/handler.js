var handler = require('../handler.js'),
	complete = require('./complete.json'),
	nasty = require('./nasty.json'),
	should = require('should'),
	assert = require('assert');


describe('handler.processData', function() {
	it('should process a complete data file', function() {
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
		handler.processData(complete).should.eql(expected)
	}),

	it('should process nasty data', function() {
		var expected = 
			{ 
				"children" : [
					{ "className" : "objective-c++", "value": 1},
					{ "className" : "java", "value": 1},
					{ "className" : "javascript", "value": 1}
				]
		};
		handler.processData(nasty).should.eql(expected)
	})
})