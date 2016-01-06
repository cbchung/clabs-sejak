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
		modules : [],
		makeModuleElement : function(name){
			var moduleE = $("<module id='"+ name +"' loaded='tring'/>");
			$("sejak-app").append(moduleE);
			this.modules.push(moduleE);
			return moduleE;
		},
		moduleCallBack : function(rc, el, data){
			if(rc){
				$(el).attr('loaded', 'success');
				$(el).html(data);
			}
			else $(el).attr('loaded', 'fail');
		},
		loadModel : function(pack, module){
//			var project = Sejak.Project;
//			for(var idx in project.modules){
//				console.log('find package-1111 : ' + project.modules[idx]);
//				if(project.models[idx].name == pack){
//					console.log('find package : ' + project.models[idx].name);
//					var items = project.models[idx].items;
//					for(var k in items){
//						if(items[k] == module){
//							console.log('find module : ' + items[k].type);
//						}
//					}
//				}
//			}
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
				var idx = model.lastIndexOf('-');
				var packageName = (idx == -1) ? 'app' : model.substring(0, idx);
				var moduleName = (idx == -1) ? model : model.substring(idx+1);
				console.log('p/n='+packageName + "/" + moduleName);
				$(this).attr('data-model-package', packageName);
				$(this).attr('data-model-name', moduleName);

				Sejak.ctx.loadModel(packageName, moduleName);
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