# Futucode2013

A visualization app for Yammer responses to the post *What programming languages did [Futupeople](http://www.futurice.com) use in 2013?*. The app is running at http://futucode2013.herokuapp.com/

The app is built with
* [node.js](http://nodejs.org/)
* [D3.js](http://d3js.org/)
* [Mocha](http://mochajs.org/)
* [Heroku](http://www.heroku.com/)

##Running

Install [node.js](http://nodejs.org/). Set DATA_SOURCE environment variable to point to the [https://developer.yammer.com/restapi/#rest-messages-threads](Yammer Messages API JSON). If you're connecting directly to Yammer, you'll need to set your [authentication token](https://developer.yammer.com/authentication/#a-testtoken) in the AUTH_TOKEN environment variable.

    $ export DATA_SOURCE=https://www.yammer.com/api/v1/threads/12345.json
    $ export AUTH_TOKEN=12345678abcdefg
    $ node server.js

By default, server.js runs in port 9000. You can change this with the PORT environment variable

##Ideas for improvement

* Load API messages from Yammer in the background while serving the old cached data
* Update the graph with a nice transition without reloading the web page

##License

Futucode2013 (C) 2014 Yrjö Kari-Koskinen <ykk@peruna.fi>

Futucode2013's source code is licensed with the MIT License, see 
[LICENSE.txt](https://github.com/ykarikos/futucode2013/blob/master/LICENSE.txt)
