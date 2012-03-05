node-bot
===

Node.js implementation of Extract Widget bot using https://github.com/Ayms/node-dom/, https://github.com/Ayms/node-gadgets/ and https://github.com/Ayms/node-googleSearch/

## Purpose:

Real-time extraction of web pages information (html, text, etc) based on given criterias.

It can be used as a server or an API, then parameters are passed in the URL, or directly as an independant node.js module.

The difference with node-gadgets is that for performances reasons it does not return the full gadgets, only the relevant information (shopbot example : seeking for "nike lebron 9" will return real-time the price of the shoes on nike store's web site)

## Install :

    npm install node-bot

or

    git clone http://github.com/Ayms/node-bot.git
    cd node-bot
    npm link .
	
Complementary modules :
	 node-ewa
	 
	 Note : node-ewa is not a public module for now, so you can only use node-bot's server/API mode. 

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
### As a server/API :
	
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

http://213.246.53.127:1341/getelements?name=nike_shoes&search=nike%20lebron%209&regexp=%5C%24%7C%C3%A2%E2%80%9A%C2%AC

To call it from a script :

````
	var xscript=document.createElement('SCRIPT');
	xscript.type="text/javascript";
	var params='name=nike_shoes'+'&search='+$E(nike shoes nikestore)+'&regexp='+$E('\\$|€');
	xscript.src='http://myserver:myport/getelements?'+params;
	document.head.appendChild(xscript);

	xscript.onload or onreadystatechange --> do what you have to do with the output
````

Output format (see more details below) : nike_shoes=(Array containing the gadgets) (where 'nike_shoes' does correspond to the parameter 'name')

````
	So to use it you can do :
	
	xscript.onload=function() {
		var res=eval('nike_shoes'+this.shoe_number); //for example if the parameter name depends on some var in your code
		if (res.length>0) {
			...
		}
		
		or simply
		
		if (nike_shoes.length>0) {
			...
		}
	}
````

See example here : http://www.extractwidget.com/nodejs/test/babyliss.html (see API code at the end of html file)

	Note : if your regexp does contain "\" and if you pass it through a js var (Example above : $E('\\$|€')) make sure to double it.
	
	Note2 : make sure that the encoding of your files/browsers is utf-8

## Parameters :

url : the url of the site where you want to extract gadgets from, if absent the url is retrieved with node-googleSearch using the value of search string (example : "nikestore nike shoes" will return the first url returned by Google Search that matches this string).

name : the name that will become the name of the global var containing the output in its 'gadgets' property (example : nike_shoes.gadgets).

regexp : while building the DOM, node-dom will use that regular expression to detect the objects that you are looking for (example : regexp=\$|€ --> you are looking for gadgets in the page that are related to a price in $ or €).

search : indicates that once the gadgets have been selected with the regexp, you can filter these gadgets based on the value of search field (example : "nikestore nike shoes" url can contain other products than shoes, node-bot will return only the results matching "nike shoes").

## Output :

The output is an Array of :

[gadget html,width,height,gadget name,reserved,base,price,html of regexp object]

No json format here for now for historical reasons and backward compatibility with existing projects (TODO later).

The first three parameters in the output are not filled by node-bot.

See https://github.com/Ayms/node-gadgets/ documentation for more details.
	
## Tests and API :

jCore server (http://www.jcore.fr) : http://213.246.53.127:1341/getelements?params

http://213.246.53.127:1341/getelements?name=nike_shoes&search=nike%20lebron%209&regexp=%5C%24%7C%C3%A2%E2%80%9A%C2%AC

You can use the API on jCore server : http://213.246.53.127:1341 (if by any unforeseen reasons the server is down, please advise).

Example of API code and use, retrieve real time the price of babyliss homelight product on different merchant sites :

http://www.extractwidget.com/nodejs/test/babyliss.html (click on "acheter maintenant" then wait for prices to be displayed in green)

See tests.txt in ./test
