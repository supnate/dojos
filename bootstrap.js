global.dojoConfig = {
	packages:[{
		name: 'dojos'
		,location: '../dojos'
	}]
	
};
global.window = global;
global.cwd = process.cwd();
require('../dojo/dojo.js');