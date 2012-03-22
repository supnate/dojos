define([
	'dojo/_base/declare'
	,'dojo/_base/Deferred'
	,'dojox/dtl'
	,'dojox/dtl/Context'
], function(declare, Deferred, dtl, DtlContext){
	var fs = require.nodeRequire('fs')
		,path = require.nodeRequire('path')
		,util = require.nodeRequire('util');
	return declare([], {
		tpl: null
		,context: null
		,pkg: ''
		,constructor: function(_file, _context, _pkg, req, res){
			this.context = _context;
			this.request = req;
			this.response = res;
			this.pkg = _pkg;
			//load page template file
			this.tpl = fs.readFileSync(_file, 'utf8');
			if(!this.tpl)this.tpl = '{{text}}';
			
			if(!this.context && path.existsSync(_file + '.js')){
				//load PageContext
				var baseName = path.basename(_file), self = this;
				require([this.pkg + '/' + baseName], function(PageContext){
					var pc = new PageContext(req, res);
					self.context = pc.getContext();
				});
			}
			
			if(!this.context){
				this.context = {text: ''};
			}
		}
		,getContent: function(){
			try{
				var template = new dtl.Template(this.tpl); 
				var context = new DtlContext(this.context);
				return template.render(context);
			}catch(e){
				return e.toString();
			}
		}
		,render: function(httpStatus, args){
			var res = this.response;
			args = dojo.mixin({
				'Content-Type': 'text/html;charset=utf-8'
			}, args);
			res.writeHead(httpStatus || 200, args);
			res.write(this.getContent(), 'utf8');
			res.end();
		}
		,status: function(){
			
		}
	});
});