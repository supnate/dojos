var path = require('path');
var dojosroot = path.dirname(module.filename);
var dojoroot = path.join(dojosroot, '../dojo');
global.dojoConfig = {
	packages:[{
		name: 'dojos'
		,location: '../dojos'
	}]
	,deps: ['dojos/main']
	,baseUrl: dojoroot
};

//Auto load dojos in dojo 1.7.x: dojoConfig.deps in NodeJS environment is not respected.
//It is fixed in the latest dojo 1.8.
process.argv.push('load=dojos');

global.dojosConfig = require('./config');
global.dojosConfig.sites.forEach(function(site){
	if(!site.id)site.id = 'site_' + (new Date()).getTime();
	if(/^\./.test(site.location)){
		//resolve relative path
		site.location = path.join(dojosroot, site.location);
	}
	site.location = site.location.replace(/\\/g, '/');
	if(!/\/$/.test(site.location))site.location += '/';
	if(/\s/.test(site.id)){
		console.log('Site name is the identifier of a site, it should not include any blank charater, use title property for display name instead');
	}else{
		//Each configured site is a package for dojo
		global.dojoConfig.packages.push({
			name: site.id
			,location: site.location
		});
	}
});

//Hack for a dojox/dtl defect: should not depend on window object in no-browser environment.
global.window = global;

require(path.join(dojoroot, 'dojo.js'));


