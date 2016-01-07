/**
 * sejak
 */

Sejak = {
	init : function(){
		/*
		 * 1. set path
		 */
		var path = window.location.pathname;
		Sejak.basePath=path.substring(0, path.lastIndexOf('/')+1);
		console.log('load:' + Sejak.basePath);
		if(Sejak.basePath.slice(-1) != '/') Sejak.basePath += '/';
		console.log('load:' + Sejak.basePath);
		
		/*
		 * 2. load project file
		 */
		this.tools.loadJS(Sejak.basePath + "sejak.project");

		/*
		 * 3. make sejak-app node
		 */
		var sejakAppE = $("<sejak-app></sejak-app>");
		$("head").append(sejakAppE);
		
	},
	initProject : function(){
		/*
		 * load modules
		 */
		this.loadModules(Sejak.Project.modules);
		console.log('load-project:' + JSON.stringify(Sejak.Project));
	},
	loadModules : function(modules){
		for(var i in  modules){
			var el = this.ctx.makeModuleElement(modules[i]);
			this.tools.loadHTML(Sejak.basePath + modules[i]+ ".module", el, this.ctx.moduleCallBack);
		}
		var modules = this.ctx.modules;
		var tmTryCount = 0;
		var tmCheck = function(){
			for(var i in modules){
				if($(modules[i]).attr('loaded') == 'tring'){
					if(tmTryCount++ > 3){
						console.log('FAIL-toReceive timeouted');
						Sejak.onLoadModules();
						return;
					}
					setTimeout(tmCheck, 500);
					return;
				}
			}
			Sejak.onLoadModules();
		};
		setTimeout(tmCheck, 100);
	},
	onLoadModules : function(){
		console.log('complete loadModules-------');
		this.tools.initPageTags();
	},
	ctx : {
		pools : [],
		makeModuleElement : function(name){
			var moduleE = $("<module id='sejak-app-module-id-"+ name +"' loaded='tring'/>");
			$("sejak-app").append(moduleE);
//			this.modules.push(moduleE);
			return moduleE;
		},
		moduleCallBack : function(rc, el, data){
			if(rc){
				$(el).attr('loaded', 'success');
				$(el).html(data);
			}
			else $(el).attr('loaded', 'fail');
		},
		loadContext : function(pack, module, el){
			var cntl = $('#sejak-app-module-id-'+pack).find("cntl[name='"+module+"']");
			var view = $('#sejak-app-module-id-'+pack).find(module);
			
			
			console.log('cntl:'+ $(cntl).text());
			console.log('view:'+ $(view).html());
			if($(cntl).text() == undefined || $(view).html() == undefined) return;
			
			var ctx = {
				e : $(el),
				scope : {},
				view : $(view).html(),
				cntl : eval("cntl= function(){ var ctx=this.scope, el=this.element; "+$(cntl).text()+"}"),
				element : function(sel){
					var html = $(this.e).html();
					console.log('e-111111111111');
					console.log(html);
					$(this.e).find("[name='navbar']").css('border', 'solid 1px blue');
					console.log('e-22222222222');
					return $(this.e).find(sel);
				},
				onData : function(data){ this.scope.onData(data); this.execute(); },
				execute : function(){
//					var content = $(view).html();
					var content = this.view;
					var results = content.match(/\{{\s*\w+\s*}}/g);
					for(var i in results){
						var v = results[i].replace("{{", "").replace("}}","").trim();
						content=content.replace(results[i], this.scope[v]);
					}
					console.log($(this.e).html());
					$(this.e).html(content);
					console.log($(this.e).html());
				}
			};
			console.log('kkkkkkkk:'+ JSON.stringify(ctx));
			this.pools.push(ctx);
			ctx.cntl();
			ctx.execute();
			ctx.onData({project:'test'});
		}
	},
	tools : {
		initPageTags : function(){
			this.loadDefaultStylers();
		},
		loadDefaultStylers : function(){
			this.loadModels();
		},
		loadModels : function(){
			$("[sj-model]").each(function(index){
				console.log('js-model='+$(this).attr('sj-model'));
				var model = $(this).attr('sj-model');
				/*
				var idx = model.lastIndexOf('-');
				var packageName = (idx == -1) ? 'app' : model.substring(0, idx);
				var moduleName = (idx == -1) ? model : model.substring(idx+1);
				console.log('p/n='+packageName + "/" + moduleName);
				$(this).attr('data-model-package', packageName);
				$(this).attr('data-model-name', moduleName);
				Sejak.ctx.loadContext(packageName, moduleName, $(this));
				*/
				var ctx = Sejak.Project.contexts[model];
				if(ctx != undefined){
					console.log('1111'+JSON.stringify(ctx));
					var idx = model.lastIndexOf('-');
					var packageName = (idx == -1) ? 'app' : model.substring(0, idx);
					var moduleName = (idx == -1) ? model : model.substring(idx+1);
					Sejak.ctx.loadContext(packageName, moduleName, $(this));
				}
			});
		},
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
			$.get( url, { "_": $.now() }, function( data ){ s(true, e, data); }, 'text').fail(function(){ if(fail !== undefined) s(false, e, null); });
		}
	}
};

$(document).ready(function(){
	Sejak.init();
});