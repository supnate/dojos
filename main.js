define(['./SiteManager'], function(siteManager){
	siteManager.getSites().forEach(function(site){
		siteManager.startSite(site.id);
	});
});