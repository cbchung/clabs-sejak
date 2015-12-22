/**
 * 
 */
(function(){
	SejakComponent = function(){};
	SejakComponent.prototype = {
		name : "comp",
		native : "<span/>",
		elements : [],
		getNative : function(){ return $(this.native); }
	};
	
	SejakContainer = Sejak.extends(SejakComponent, {name:'cont', native:'<div/>'});

	Sejak.ctx.components.push(new SejakComponent());
	Sejak.ctx.components.push(new SejakContainer());
	
})();