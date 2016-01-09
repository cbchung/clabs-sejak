/**
 * sejak
 */

Sejak = {
	init : function(){
		/*
		 * 0. initialize this Package
		 */
		Sejak.initPackage();
		
		/*
		 * 1. set Sejak.basePath
		 */
		var path = window.location.pathname;
		Sejak.basePath=path.substring(0, path.lastIndexOf('/')+1);
		if(Sejak.basePath.slice(-1) != '/') Sejak.basePath += '/';
		
		/*
		 * 2. make sj-info node
		 */
		this.InfoE = $("<sj-info></sj-info>");
		$("head").append(this.InfoE);

		/*
		 * 3. load project file
		 * >>프로젝트에서 Document Loading시, Sejak.initProject() 호출 요.
		 */
		Sejak.tk.resHandle.loadJS(Sejak.basePath + "app.project");
	},
	initProject : function(){
		for(var i in  Sejak.Project.modules){
			var el = Sejak.ctx.makeModuleElement(Sejak.Project.modules[i]);
			Sejak.tk.resHandle.loadHTML(Sejak.basePath + Sejak.Project.modules[i]+ ".module", el, Sejak.ctx.moduleCallBack);
		}
		var modules = Sejak.ctx.modules;
		var tmTryCount = 0;
		var tmCheck = function(){
			for(var i in modules){
				if($(modules[i]).attr('loaded') == 'tring'){
					if(tmTryCount++ > 3){
						console.log('FAIL-toReceive timeouted');
						Sejak.initPage();
						return;
					}
					setTimeout(tmCheck, 500);
					return;
				}
			}
			Sejak.initPage();
		};
		setTimeout(tmCheck, 100);
	},
	initPage : function(){
		Sejak.Contexts = [];
		$('[sj-model]').each(function(index){
			var sjModel = $(this).attr('sj-model');
			$(this).attr('sj-mseq', index);
			$(this).on('sjEvent', Sejak.ctx.eventHandle);
//			$(this).on('click', Sejak.ctx.eventHandle);
			
			var ctx = { el : $(this), scope : {} };
			Sejak.Contexts[index] = ctx;
			
			var pctx = Sejak.Project.contexts[sjModel];
			if(pctx == undefined) return;	// not found this configure
			
			var idx = pctx[0].lastIndexOf('-');
			
			ctx.sjMseq = index;
			ctx.sjController = pctx[0];
			ctx.sjRef = pctx[1];
			ctx.sjPack = idx==-1 ? 'app' : pctx[0].substring(0, idx);
			ctx.sjCntl = idx==-1 ? pctx[0] : pctx[0].substring(idx+1);
			ctx.view = $('sj-info ' + ctx.sjPack).find(ctx.sjCntl).html();
			ctx.load = Sejak.ctx.load;
			ctx.map = Sejak.ctx.map;
			ctx.loadData = Sejak.ctx.loadData;
			ctx.run = Sejak.ctx.run;
			
			ctx.load(ctx);
			ctx.loadData(ctx, { project:'cbcworld' });
			// ctx.map(ctx);
			
			$(this).trigger('sjEvent', Sejak.tk.event.message("notify", 'Notification'));
		});
	},
	initPackage : function(){
		var event = new CustomEvent('sjEvent', {
			detail: Sejak.tk.event.params,
			bubbles: true,
			cancelable: true
		});
	},
	tk : {
		event : {
			type : [ '_NS', 'notify' ],
			params : {
				type: 0,
				message: {}
			},
			message : function(type, obj){
				var find = false, k;
				for(k in this.type) if(this.type[k] == type){
					find = true;
					break;
				}
				var _t = find ? k : 0;
				return {
					type: _t,
					message: obj
				};
			}
		},
		resHandle : {
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
	},
	ctx : {
		pools : [],
		makeModuleElement : function(name){
			var moduleE = $("<"+ name +" loaded='tring'/>");
			$(Sejak.InfoE).append(moduleE);
			return moduleE;
		},
		moduleCallBack : function(rc, el, data){
			if(rc){
				$(el).attr('loaded', 'success');
				$(el).html(data);
			}
			else $(el).attr('loaded', 'fail');
		},
		eventHandle : function(event, param){
//			for(var e in event) console.log(e, ":" + event[e]);
//			for(var e in param) console.log(e, ":" + param[e]);
//			console.log('event.type' + event.type);
//			console.log('event.target:' + $(event.target).attr('sj-mseq'));
			console.log('param.type:' + param.type + ":" + param.message);
		},
		run : function($ctx){
			var $scope = $ctx.scope;
			var $elm = $ctx.el;
			try{
				eval($('sj-info ' + $ctx.sjPack).find("cntl[name='" + $ctx.sjCntl + "']").text())
			}catch(e){
				console.log('error:', e);
			}
			$ctx.view = $($elm).html();
			$ctx.compiled = $ctx.view;
			$ctx.map($ctx);
		},
		map : function(ctx){
			var cont = ctx.compiled;
			var results = cont.match(/\{{\s*\w+\s*}}/g);
			for(var i in results){
				var v = results[i].replace("{{", "").replace("}}","").trim();
				cont=cont.replace(results[i], ctx.scope[v]);
			}
			$(ctx.el).html(cont);
		},
		loadData : function(ctx, data){
			$(ctx.el).html(ctx.compiled);
			if(ctx.scope.onData != undefined) ctx.scope.onData(data);
			ctx.compiled = $(ctx.el).html();
			ctx.map(ctx);
		},
		load : function(ctx){
			if(ctx.scope.onCompile != undefined) ctx.scope.onCompile(ctx.view);
			var cont = ctx.view;
			if(cont != undefined){
				var results = cont.match(/\$sj:(scope|ctx)\./g);
				for(var i in results){
					var v = results[i]
						.replace('$sj:ctx', 'Sejak.Contexts[' + ctx.sjMseq +']')
						.replace('$sj:scope', 'Sejak.Contexts[' + ctx.sjMseq +'].scope');
					cont=cont.replace(results[i], v);
				}
			}
			$(ctx.el).html(cont);
			ctx.run(ctx);
		}
	}
};

$(document).ready(function(){
	Sejak.init();
});