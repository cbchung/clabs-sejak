/**
 * sejak
 */
Sejak = {
	m : { sj:{}, app:{} },
	c : [],
	init : function(){
		/*
		 * set the basePath
		 */
		var path = window.location.pathname;
		Sejak.basePath=path.substring(0, path.lastIndexOf('/')+1);
		if(Sejak.basePath.slice(-1) != '/') Sejak.basePath += '/';

		/*
		 * setEventHandler
		 */
		this.setEvents();
		
		/*
		 * setPremitives
		 */
		this.setPrimitives();
		
		/*
		 * loadProject
		 */
		this.loadProject();
	},
	initProject : function(){
		var mc = Sejak.Project.modules.length;
		for(var i in Sejak.Project.modules){
			Sejak.tk.loadHTML(Sejak.basePath + Sejak.Project.modules[i]+ ".module", 
					Sejak.Project.modules[i], function(rc, pack, data){
				if(!rc){
					console.log('error: loading '+ pack + ".module");
					mc--;
					if(mc == 0) Sejak.loadPage();
					return;
				}
				
				var nodelist = $.parseHTML(data);
				for(var item in nodelist){
					if(nodelist[item].nodeType == 1){
						var node = nodelist[item];
						var name=nodelist[item].nodeName.toLowerCase();
						var ext=node.getAttribute('ext');
						if(ext == undefined) ext = 'sj.model';
						else ext = ext.replace(/-/g, '.');
						
						var child = {};
						for(var i=0; i<node.children.length; i++){
							var c = node.children[i];
							switch(c.nodeName.toLowerCase()){
								case 'cntl':
									child.cntl = c.innerHTML;
									break;
								case 'view':
									child.view = c.innerHTML;
									break;
								case 'css':
									child.css = c.innerHTML;
									break;
								default:
							}
						}
					
						try{
							var packName = pack.replace('/-/g', '.');
							var packs = packName.split('.');
							for(var i=0, v=Sejak.m; i<packs.length; i++){
								if(v[packs[i]] == undefined) v[packs[i]] = {};
								v = v[packs[i]];
							}
							eval('Sejak.m.' + packName + '.' + name + '= Sejak.extend(Sejak.m.' + ext+ ', {'+
									' source : child })');
						}catch(e){
							console.log('error',e);
						}
					}
				}
				mc--;
				if(mc == 0) Sejak.loadPage();
			});
		}
	},
	setEvents : function(){
		/*
		 * make more event define
		 */
		new CustomEvent('sjEvent', { detail:{type:'', params:{}}, bubbles:true, cancelable:true });
		new CustomEvent('sjMsg', { detail:{type:'', params:{}}, bubbles:true, cancelable:true });
		
		/*
		 * add event handler
		 */
		$(document).on('sjEvent', Sejak.event.sjEventListener);
	},
	setPrimitives : function(){
		Sejak.m.sj.model = function(el, seq){
			this.el = el;
			this.type = $(el).attr('sjm');
			this.seq = seq;
			this.scope = {};
		}
		Sejak.m.sj.model.prototype = {
			onLoad : function(){
				console.log('onLoad---------------------:', this.source.css);
				var run = function($ctx){
					var $scope = $ctx.scope;
					var $elm = $ctx.el;
					try{
						eval($ctx.source.cntl);
					}catch(e){
						console.log('error:', e);
					}
					
					// $elm의 내용을 선행 바꾸기 원한다면, onCompile에서 오직 한 번 바꿀 수 있다.
					if($scope.onCompile != undefined) $scope.onCompile();
					$ctx.view = $($elm).html();
					
					var cont = $ctx.view;
					var results = cont.match(/\$sj:(scope|ctx)\./g);
					for(var i in results){
						var v = results[i] == '$sj:ctx' ? 
									'Sejak.c[' + $ctx.seq +'].' : 'Sejak.c[' + $ctx.seq +'].scope.';
						cont=cont.replace(results[i], v);
					}
					$($ctx.el).html(cont);					
					$ctx.compiled = cont;
					$ctx.map();
				};
				run(this);
				Sejak.event.sendMessage(this.el, 'onLoadComplete', { seq: this.seq });
			},
			onDataLoad : function(data){
				console.log('onDataLoad---------------------:', $(this.el).attr('dref'));
				Sejak.tk.loadJSON($(this.el).attr('dref'), this, function(rc, ctx, data){
					if(rc){
						$(ctx.el).html(ctx.compiled);
						if(ctx.scope.onData != undefined) ctx.scope.onData(data);
						ctx.compiled = $(ctx.el).html();
						ctx.map(ctx);
					}
					else console.log('dataLoad from ' + $(ctx.el).attr('dref') + " error");
				});
			},
			onMessage : function(event, param){
				console.log('type:'+param.type, param.params);
				switch(param.type){
					case 'onLoad' :
						Sejak.c[param.params.seq].onLoad();
						break;
					case 'onLoadComplete' :
						Sejak.c[param.params.seq].onDataLoad();
						break;
					default :
						break;
				}
			},
			map : function(){
				var cont = this.compiled;
				var results = cont.match(/\{{\s*\w+\s*}}/g);
				for(var i in results){
					var v = results[i].replace("{{", "").replace("}}","").trim();
					cont=cont.replace(results[i], this.scope[v]);
				}
				$(this.el).html(cont);
			}
		};
	},
	loadProject : function(){
		Sejak.tk.loadJS(Sejak.basePath + "app.project");
	},
	loadPage : function(){
		$('[sjm]').each(function(index){
			var path=$(this).attr('sjm');
			var pack = path.replace(/-/g, '.');
			try{
				Sejak.c[index] = eval('new Sejak.m.'+pack+'($(this), index)');
				$(this).on('sjMsg', Sejak.c[index].onMessage);
				Sejak.event.sendMessage($(this), 'onLoad', { seq: index });
//				Sejak.c[index].onMessage('sendingManualy', {});
			}catch(e){ console.log('error', e); }
		});
	},
	extend : function(o, a){
		var t = function(){ o.apply(this, arguments); };
		t.prototype = o.prototype;
		t.prototype.constructor = t;
		for(var k in a) t.prototype[k] = a[k];
		return t;
	},
	event : {
		sjEventListener : function(type, params){
			console.log('sjEventListener');
		},
		sendMessage : function(tgt, type, params){
			$(tgt).trigger('sjMsg', {type:type, params:params});
		}
	},
	tk : {
		loadCSS : function(href) {
			try{
				var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
				$("head").append(cssLink); 
			}catch(e){ console.log('loadCSS:' + e); }
		},
		loadJS : function(src) {
			try{
			     var jsLink = $("<script type='text/javascript' src='"+src+"'>");
			     $("head").append(jsLink); 
			}catch(e){ console.log('loadJS:' + e); }
		},
		loadHTML : function(url, e, s){
			$.get( url, { "_": $.now() }, function( data ){ s(true, e, data); }, 'text')
			.fail(function(){ s(false, e, null); });
		},
		loadJSON : function(url, e, cb){
			u = this.routeUrl(url);
			$.ajax(u.ref, {
				  dataType: 'json', //json data type
				  data: u.isCache ? {"_": $.now()} : null,
				  success: function(data,status,xhr){ cb(true, e, data); },
				  error: function(xhr,staus,et){ cb(false, e, et); }
			});			
		},
		routeUrl : function(url){
			var caches = Sejak.Project.configure.cache;
			for(var i in caches){
				if(caches[i].prefix == url.substring(0, caches[i].prefix.length)){
					return { ref: url.replace(caches[i].prefix, caches[i].map), isCache: true };
				}
			}
			return { ref: url, isCache: false };
		}
	}
}

$(document).ready(function(){
	Sejak.init();
});