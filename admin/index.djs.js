define([
	'dojo/_base/declare'
	,'dojo/date'
	,'dojos/PageContext'
	,'dojos/SiteManager'
], function(declare, date, PageContext, siteManager){
	return declare([PageContext], {
		getContext: function(){
			var sites = [];
			siteManager.getSites().forEach(function(site){
				sites.push({
					name: site.name
					,location: site.location
					,port: site.port
					,status: site.status
					,action: site.status == 'Running' ? 
						'<a href="#" title="Stop"><img src="images/stop.png"/></a>' 
						: '<a href="#" title="Start"><img src="images/start.png"/></a>'
				});
			});
			return {sites: sites};
		}
	});
});
