var handler = require('../handler.js'),
	data = require('./data.json'),
	should = require('should'),
	assert = require('assert');


describe('handler.processData', function() {
	it('should process the data', function() {
		var expected = 
			[["javascript",3],["java",2],["scala",2],
			 ["c#",1],["objective-c",1],["clojure",1]];
		handler.processData(data).should.eql(expected)
	})
})