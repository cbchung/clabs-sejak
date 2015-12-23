/**
 * sejak-app
 */

SejakES = {
	init : function(){
		if("undefined" == typeof SejakApp) SejakApp = { modules : [] };
		if("undefined" == typeof SejakApp.path){
			var path = window.location.pathname;
			SejakApp.path = path.substring(0, path.lastIndexOf('/')+1);
		}
		if(SejakApp.path.slice(-1) != '/') SejakApp.path += '/';		
		console.log('SejakApp : '+ JSON.stringify(SejakApp));
		
		/*
		 * make sejak-app node
		 */
		var sejakAppE = $("<sejak-app/>");
		$("head").append(sejakAppE);

		/*
		 * load modules
		 */
		this.loadModules(SejakApp.modules);
	},
	loadModules : function(modules){
		for(var i in  modules){
			var el = this.ctx.makeModuleElement(modules[i]);
			this.tools.loadHTML(SejakApp.path + modules[i]+ ".module", el, this.ctx.moduleCallBack);
		}
		var modules = this.ctx.modules;
		var tmTryCount = 0;
		var tmCheck = function(){
			for(var i in modules){
				if($(modules[i]).attr('loaded') == 'tring'){
					if(tmTryCount++ > 3){
						console.log('FAIL-toReceive timeouted');
						SejakES.onLoadModules();
						return;
					}
					setTimeout(tmCheck, 500);
					return;
				}
			}
			SejakES.onLoadModules();
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
	SejakES.init();
});