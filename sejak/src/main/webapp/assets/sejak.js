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
			this.type = $(el).attr('sjm');
			this.seq = seq;
		}
		Sejak.m.sj.model.prototype = {
			onLoad : function(){},
			onDataLoad : function(data){},
			onMessage : function(){
				
			},
			test : function(){ console.log('test', this.seq); }
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
				Sejak.c[index].test();
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