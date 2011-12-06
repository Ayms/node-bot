node-bot
===

Node.js implementation of Extract Widget bot using https://github.com/Nais/node-dom/, https://github.com/Nais/node-gadgets/ and https://github.com/Nais/node-googleSearch/

## Purpose:

Real-time extraction of web pages information (html, text, etc) based on given criterias.

It can be used as a server, then parameters are passed in the URL, or directly as an independant node.js module.

The difference with node-gadgets is that for performances reasons it does not return the full gadgets, only the relevant information (shopbot example : seeking for "nike lebron 9" will return real-time the price of the shoes on nike store web site)

## Install :

    npm install node-bot

or

    git clone http://github.com/Nais/node-bot.git
    cd node-bot
    npm link .
	
Complementary modules :
	 node-ewa
	 
	 Note : node-ewa is not a public module for now, so you can only use node-bot's server mode. 

## Use :

	getelements.js :
	
### As a module :
	
````
	var getElements = require('node-bot').getElements;
	
	var $E=encodeURIComponent;
	
	var response={
		end:function(gadgets) {
			console.log(gadgets);
			//output format, see below
		}
	};
	
	var params='search='+$E('nike shoes')'+'&name='+$E(nike_shoes)+'&regexp='+$E('\\$|€');

	getElements(params,response);
````
### As a server :
	
````
	var http = require('http'),  
	URL = require('url'),
	getElements = require('node-bot').getElements;

	var handleRequest = function (request, response) {
	  
		var qs = URL.parse(request.url);
		  
		if (qs.pathname == '/getelements'){
			getElements(qs.query,response);
		};
	};

	http.createServer(handleRequest).listen(myport);
````
To call it directly :

http://myserver:myport/getelements?name=nike_shoes&search='nikestore nike lebron9'&regexp=\$|€

Example with encoded parameters to retrieve the price of "lebron9" shoes on nike store :

http://213.246.53.127:1341/getelements?name=nike_shoes&search=nike%20lebron%209&regexp=%5C%24%7C%E2%82%AC

To call it from a script :

````
	var xscript=document.createElement('SCRIPT');
	xscript.type="text/javascript";
	var params='name=nike_shoes'+'&search='+$E(nike shoes nikestore)+'&regexp='+$E('\\$|€');
	xscript.src='http://myserver:myport/getelements?'+params;
	document.head.appendChild(xscript);

	xscript.onload or onreadystatechange --> do what you have to do with the output
````
Output format (see more details below) : nike_shoes.gadgets=(Array containing the gadgets) (where test corresponds to the parameter 'name')

Example : xscript.onload=function() {alert(nike_shoes.gadgets)};

	Note : if your regexp does contain "\" and if you pass it through a js var (Example above : $E('\\$|€')) make sure to double it.
	
	Note2 : make sure the encoding of your files/browsers is utf-8

## Parameters :

url : the url of the site where you want to extract gadgets from, if absent the url is retrieved with node-googleSearch using the value of search string (example : "nikestore nike shoes" will return the first url returned by Google Search that matches this string).

name : the name that will become the name of the global var containing the output in its 'gadgets' property (example : nike_shoes.gadgets).

regexp : while building the DOM, node-dom will use that regular expression to detect the objects that you are looking for (example : regexp=\$|€ --> you are looking for gadgets in the page that are related to a price in $ or €)

search : indicates that once the gadgets have been selected with the regexp, you can filter these gadgets based on the value of search (example : "nikestore nike shoes" url can contain other products than shoes, node-bot will return only the results matching "nike shoes")

## Output :

The output is an Array of :

[gadget html,width,height,gadget name,reserved,base,price,html of regexp object]

The first three parameters in the output are not filled by node-bot.

See https://github.com/Nais/node-gadgets/ documentation for more details.
	
## Tests :

Naïs server : http://213.246.53.127:1341/getelements?params

See tests.txt in ./test
