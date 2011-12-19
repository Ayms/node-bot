var http = require('http'), 
	URL = require('url'),
	googleSearch = require('node-googleSearch').googleSearch,
	genGadgets = require('node-gadgets').genGadgets;

var getElements = function(query,response){

	var params={}; //search-gadget-regexp-url

	var $E=encodeURIComponent;

	query.split('&').forEach(function(param){
		var parts = param.split('=');
		params[parts[0].trim()] = (decodeURIComponent(parts[1]) || '').trim();
	});

	var resp={
		end : function(res) {
			try {
				if (res.length) {
					var url=res[0].url;
					var p='url='+$E(url)+'&name='+$E(params.name);
					url=url.split('/')[2];
					var t=params.search?params.search.toLowerCase().split(' '):'';
					var search=[];
					var l=t.length;
					for (var i=0;i<l;i++) {
						var re=new RegExp(t[i],"g");
						if (!re.test(url)) {
							search.push(t[i]);
						}
					};
					search=search.join(' ');
				};
				//Example : babyliss g910e cdiscount
				//becomes : babyliss g910e
			
				if (params.gadget) {
					p +='&fetch='+$E('{"img":"", "input":""}')+'&proc='+$E('{"img":"","input":""}')+'&gadget=true&price=true&search='+$E(search)+'&regexp='+$E(params.regexp);
				} else {
					p +='&fetch='+$E('{"img":"", "input":""}')+'&proc='+$E('{"img":"","input":""}')+'&price=true&search='+$E(search)+'&regexp='+$E(params.regexp);		
				};

				//console.log(p);

				var resp2={
					
					end : function(res) {
					
						var head = {'Content-Type': 'text/javascript' };
								
						if (response.writeHead) {
						
							response.writeHead(200, head);
							
							response.end(params.name+'='+JSON.stringify(res)+';');
							
							/*var l=res.length;
							for (var i=0;i<l;i++) {
								console.log(res[i][3]+' '+res[i][6]);
							}*/
						
						} else {
							response.end(res);
						}
					}
				};

				genGadgets(p,resp2);

			} catch(ee) {
				response.end('Bad formatted request');
			}
		}
	};

	if (!params.url) {
		googleSearch('search='+$E(params.search),resp);
	} else {
		resp.end([{url:params.url}]);
	}

};

var handleRequest = function (request, response) {

	var qs = URL.parse(request.url);

	if (qs.pathname == '/getelements'){
		try {
			getElements(qs.query,response);
		} catch(ee) {
			response.end('Bad formatted request');
		};
	};
};

var launchServer = function(port) {
	http.createServer(handleRequest).listen(port);
};

exports.launchServer = launchServer;
exports.getElements = getElements;