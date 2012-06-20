define([
	'dojo/_base/declare'
	,'dojo/_base/lang'
	,'dojo/_base/Deferred'
	,'dojox/dtl'
	,'dojox/dtl/Context'
], function(declare, lang, Deferred, dtl, DtlContext){
	var fs = require.nodeRequire('fs')
		,path = require.nodeRequire('path')
		,util = require.nodeRequire('util');
	return declare([], {
		tpl: null
		,context: null
		,pkg: ''
		,constructor: function(_file, _context, mid, req, res){
			this.context = _context;
			this.request = req;
			this.response = res;
			this.mid = mid;
			//load page template file
			this.tpl = fs.readFileSync(_file, 'utf8');
			if(!this.tpl)this.tpl = '{{text}}';
			
			var self = this;
			if(!this.context && path.existsSync(_file + '.js')){
				require([mid], function(PageContext){
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
			args = lang.mixin({
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