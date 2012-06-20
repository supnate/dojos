define([
	'dojo/_base/declare'
	,'dojo/_base/lang'
	,'./Server'
], function(declare, lang, Server){
	// summary:
	//	Represent a web site which contains a dojos/Server instance. 
	//  Site object also provides all site related information.
	
	return declare(null, {
		//id:
		//	Dojo AMD package name of the site
		id: ''
		
		//name:
		//	Display name of the site
		,name: ''
		
		//location:
		//	Root folder of the site
		,location: ''
		
		//status:
		//	Site status: Running, Stopped
		,status: ''
		
		//port:
		//	The listening port of the web site
		,port: 1337
		
		//server:
		//	The dojos/Server instance running the site
		,server: null
		
		,constructor: function(args){
			lang.mixin(this, args);
		}
		,start: function(){
			// summary:
			//	Start the site by starting a dojos/Server instance to listen on given port
			
			if(!this.server)this.server = new Server({
				id: this.id
				,location: this.location
				,port: this.port
			});
			!this.server.started && this.server.start();
			this.status = 'Running';
		}
		,stop: function(){
			// summary:
			//	Stop the site by stopping the dojos/Server instance
			
			if(!this.server)return;
			this.server.started && this.server.stop();
			this.status = 'Stopped';
		}
	});
});