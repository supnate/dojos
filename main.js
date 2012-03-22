define(['./Server', './config'], function(Server, config){
	var path = require.nodeRequire('path');
	config.sites.forEach(function(site){
		site.root = path.join(global.cwd, site.location);
		var s = new Server(site);
		s.create();
	});
});