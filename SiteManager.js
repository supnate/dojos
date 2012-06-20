define([
	'dojo/_base/lang'
	,'./Site'
], function(lang, Site){
	var sites = global.dojosConfig.sites.map(function(siteConfig){
		return new Site(siteConfig);
	});
	var sitesHash = {};
	sites.forEach(function(site){
		site.status = 'stopped';
		sitesHash[site.id] = site;
	});
	
	var manager = {
		startSite: function(id){
			var site = this.getSite(id);
			site.start();
		}
		,stopSite: function(id){
			var site = this.getSite(id);
			site.stop();
		}
		,getSites: function(){
			return sites;
		}
		,getSite: function(id){
			return sitesHash[id];
		}
	};
	
	return manager;
});