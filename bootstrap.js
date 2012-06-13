global.dojoConfig = {
	packages:[{
		name: 'dojo'
		,location: '../dojo'
	},{
		name: 'dojox'
		,location: '../dojox'
	},{
		name: 'dojos'
		,location: '../dojos'
	}]
	,baseUrl: 'e:/workspace/dojo/'
	
};
global.window = global;
global.cwd = process.cwd();

require('../dojo/dojo.js');
