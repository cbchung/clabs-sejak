/**
 * 
 */
(function(){
	Sejak = {
		init : function(){
			this.initObjects();
		},
		initObjects : function(){
			for(var i in Sejak.ctx.components){
				console.log('initObject-comp:' + Sejak.ctx.components[i].name)
				this.loadComponent(Sejak.ctx.components[i]);
			}
			// fire onInit notification-event
			
			for(var i in Sejak.ctx.stylers){
				var styler = Sejak.ctx.stylers[i];
				console.log('initObject-styler:' + styler.name + "," +i +":"+Sejak.ctx.stylers[i]);
				$(".sj-"+styler.name).each(function(){
					styler.load(this);
				});
			}
		},
		loadComponent : function(component){
			var ar = [];
			var elementName = component.name;
			$(elementName).each(function(){
			    ar.push({length: $(this).parents().length, elmt: $(this)});
			});
			ar.sort(function(a,b) {
			    if (a.length - b.length > 0)  return -1;					  
			    if (a.length - b.length < 0)  return 1;					    
			    return 0;
			});
			// 2. native HTML로 치환
			for (var i=0; i<ar.length; i++) {
				var ne = component.getNative();
				var o = ar[i].elmt;
				$(o).each(function() {
					$.each(this.attributes, function() {
						$(ne).attr(this.name, this.value);
					});
					$(ne).addClass(elementName);
				});
				$(ne).html($(o).html());
				$(o).replaceWith(ne);
				component.elements.push({ e: ne });						
			}
		},
		extends : function(classObject, props){
			var klass = function(){classObject.call(this);};
			klass.prototype = Object.create(classObject.prototype);
			for(var pk in props) klass.prototype[pk] = props[pk];
			return klass;
		}
	};
	
	Sejak.ctx = {
		components : [],
		stylers : []
	};

	
	$(document).ready(function(){
		Sejak.init();
	});
	
})();