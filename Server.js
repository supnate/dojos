define([
	'dojo/_base/declare'
	,'dojo/_base/Url'
	,'./Page'
	,'./redirect'
	,'./types'
], function(declare, Url, Page, redirect, TYPES){
	var http = require.nodeRequire('http')
		,fs = require.nodeRequire('fs')
		,util = require.nodeRequire('util')
		,path = require.nodeRequire('path');
	
	function getInternalPage(name){
		return dojo.baseUrl + '../dojos/pages/'+ name +'.djs';
	}
	
	return declare('dojos.Server', null, {
		constructor: function(_siteConfig){
			this.siteConfig = _siteConfig;
		}
		,create: function(){
			var self = this;
			http.createServer(function (req, res){
				req.originalUrl = req.url;
				var url = req.url = new Url(redirect.route(req.url))
					, absPath = self.mapPath(url.path), page;
				if(!path.existsSync(absPath)){
					page = new Page(getInternalPage('404'), null, self.siteConfig.name, req, res);
					page.render(404, {});
					return;
				}
				if(fs.statSync(absPath).isDirectory()){
					self.dir(req, res);
					return;
				}
				var ext = path.extname(absPath).toLowerCase();
				if(ext == '.djs'){
					var page = new Page(absPath, null, self.siteConfig.name, req, res);
					self.djs(req, res, page);
				}else{
					self.file(req, res, ext);
				}
			}).listen(this.siteConfig.port||1337);
			console.log('Server running at port ' + this.siteConfig.port);
		}
		,file: function(req, res, ext){
			fs.readFile(this.mapPath(req.url.path),'binary',function(err,file){  
		        res.writeHead(200,{  
		            'Content-Type': TYPES[ext] || 'text/plain'
		        });  
		        res.write(file, 'binary');  
		        res.end();  
		    })  
		}
		,dir: function(req, res){
			var rp = req.url.path, ap = this.mapPath(rp), self = this;
			fs.readdir(ap, function(error, files){
				
				files = files.map(function(file){
					var absPath = (ap + '/' + file).replace('//', '/'), s = fs.statSync(absPath);
					return {
						name: file + (s.isDirectory()? '/' : '')
						,path: (rp + '/' + file).replace('//', '/')
						,type: s.isDirectory() ? 'folder' : (/\./.test(file) ? file.split('.').pop() : '')
						,size: Math.round(s.size / 1000) + 'KB'
						,lastModified: s.mtime.getMonth() + '/' + s.mtime.getDate() + '/' + s.mtime.getFullYear() + ' ' + s.mtime.getHours() + ':' + s.mtime.getMinutes()
					};
				});
				files.sort(function(f1, f2){
					if(/\/$/.test(f1.name) && !/\/$/.test(f2.name)){return -1;}
					else if(/\/$/.test(f2.name) && !/\/$/.test(f1.name)){return 1;}
					else return f1.name > f2.name ? 1 : -1;
				});
//				if(rp != '/'){
//					files.unshift({
//						name: 'Parent Directory'
//						,path: rp.replace(/[^\/]+\/?$/, '')
//						,type: ''
//						,size: ''
//						,lastModified: ''
//					});
//				}
				var a = '/', tp = rp;
				rp = '<a href="/">root</a> ' + rp.replace(/[^\/]+/g, function(s){
					a += (s + '/');
					return ' <a href="' + a + '">' + s + '</a> ';
				});
		        var page = new Page(dojo.baseUrl + '../dojos/pages/folder.djs', {
					path: rp
					,title: tp
					,files: files
				}, self.siteConfig.name, req, res);
				page.render();
		    });
		}
		,_404: function(req, res){
			this.djs(req, res, new Page(dojo.baseUrl + '../dojos/pages/404.djs', {}, this.siteConfig.name), 404);
		}
		,djs: function(req, res, page, resCode){
			res.writeHead(resCode || 200, {'Content-Type': 'text/html;charset=utf-8'});
			res.write(page.getContent(), 'utf8');
			res.end();
		}
		,mapPath: function(p){
			var p = (this.siteConfig.root + p).replace('//', '/');
			return p;
		}
	});
});
