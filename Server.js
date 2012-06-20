define([
	'dojo/_base/declare'
	,'dojo/_base/lang'
	,'dojo/_base/Url'
	,'dojo/_base/config'
	,'./Page'
	,'./UrlRewriter'
	,'./types'
], function(declare, lang, Url, config, Page, urlRewriter, TYPES){
	// summary:
	//	Represents a dojos web server. It starts an nodejs http server to handle requests.
	//	The server can list directories and render dojox/dtl based web page: dojos/Page
	//	This is usually used in a dojos/Site instance and maybe run in a separate process.
	
	var http = require.nodeRequire('http')
		,fs = require.nodeRequire('fs')
		,util = require.nodeRequire('util')
		,path = require.nodeRequire('path');
	
	function getInternalPage(name){
		return path.join(config.baseUrl, '../dojos/pages/' + name + '.djs');
	}
	return declare(null, {
		port: 1337
		,id: ''
		,location: ''	//root folder of the server site
		,started: false
		,_httpServer: null
		,constructor: function(args){
			lang.mixin(this, args || {});
		}
		,start: function(){
			// summary:
			//	Start the server.
			var self = this;
			//TODO: Reuse http server object when restarted
			this._httpServer = http.createServer(function (req, res){
				try{
					req.originalUrl = req.url;
					var url = req.url = new Url(urlRewriter.rewrite(req.url))
						, absPath = self.mapPath(url.path), page;
					if(!path.existsSync(absPath)){
						page = new Page(getInternalPage('404'), {}, null, req, res);
						page.render(404, {});
						return;
					}
					if(fs.statSync(absPath).isDirectory()){
						//List files of a directory
						self.dir(req, res);
						return;
					}
					var ext = path.extname(absPath).toLowerCase();
					if(ext == '.djs'){
						//Process a djs file
						var page = new Page(absPath, null, self.pageMid(absPath), req, res);
						self.djs(req, res, page);
					}else{
						//Other files
						self.file(req, res, ext);
					}
				}catch(e){
					console.log('error: ', e);
				}
			}).listen(this.port);
			this.started = true;
			
			console.log('Server running at port ' + this.port);
		}
		,stop: function(){
			// summary:
			//	Stop the server.
			
			this.started = false;
			this._httpServer && this._httpServer.close();
			console.log('Server stopped at port ' + this.port);
			
		}
		,file: function(req, res, ext){
			// summary:
			//	Response file's content with the content-type based on file's extension
			fs.readFile(this.mapPath(req.url.path),'binary',function(err,file){  
		        res.writeHead(200,{  
		            'Content-Type': TYPES[ext] || 'text/plain'
		        });  
		        res.write(file, 'binary');  
		        res.end();  
		    })  
		}
		,dir: function(req, res){
			// summary:
			//	Render the folder list.
			
			var rp = req.url.path, ap = this.mapPath(rp), self = this;
			fs.readdir(ap, function(error, files){
				files = files.map(function(file){
					var absPath = path.join(ap, file), s = fs.statSync(absPath);
					return {
						name: file + (s.isDirectory()? '/' : '')
						,path: (rp + '/' + file).replace('//', '/')
						,type: s.isDirectory() ? 'folder' : (/\./.test(file) ? file.split('.').pop() : '')
						,size: s.isDirectory() ? '0KB' : (Math.round(s.size / 1000) + 'KB')
						,lastModified: (s.mtime.getMonth() + 1) + '/' + s.mtime.getDate() + '/' + s.mtime.getFullYear() + ' ' + s.mtime.getHours() + ':' + s.mtime.getMinutes()
					};
				});
				files.sort(function(f1, f2){
					if(/\/$/.test(f1.name) && !/\/$/.test(f2.name)){return -1;}
					else if(/\/$/.test(f2.name) && !/\/$/.test(f1.name)){return 1;}
					else return f1.name > f2.name ? 1 : -1;
				});

				var a = '/', tp = rp;
				rp = '<a href="/">root</a> ' + rp.replace(/[^\/]+/g, function(s){
					a += (s + '/');
					return ' <a href="' + a + '">' + s + '</a> ';
				});
		        var page = new Page(getInternalPage('folder'), {
					path: rp
					,title: tp
					,files: files
				}, null, req, res);
				page.render();
		    });
		}
		,djs: function(req, res, page, resCode){
			// summary:
			//	Render a dojos server page.
			res.writeHead(resCode || 200, {'Content-Type': 'text/html;charset=utf-8'});
			res.write(page.getContent(), 'utf8');
			res.end();
		}
		,mapPath: function(p){
			// summary:
			//	Map the relative file path to the site's root path
			p = path.join(this.location, p);
			return p;
		}
		,pageMid: function(pageAbsPath){
			// summary:
			//	Get the module id of a page's back end module
			var mid = this.id + '/' + pageAbsPath.substring(this.location.length);
			mid = mid.replace(/\\/g, '/');
			return mid;
		}
	});
});
