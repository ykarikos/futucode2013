var handler = require('../handler.js'),
	data = require('./data.json'),
	should = require('should'),
	assert = require('assert');


describe('handler.processData', function() {
	it('should process the data', function() {
		var expected = 
			[["javascript",3],["scala",2],["clojure",1],
			 ["java",2],["objective-c",1],["c#",1]];
		handler.processData(data).should.eql(expected)
	})
})