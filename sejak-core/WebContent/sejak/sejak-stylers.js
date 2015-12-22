/**
 * 
 */
(function(){
	SejakStylers = function(){};
	SejakStylers.prototype = {
		name : 'no-defined',
		load : function(el){ consol.log('SejakStylers-undefined'); }
	};

	/*
	 * sj-full-height
	 */
	var styleFullHeight = Sejak.extends(SejakStylers, {
		name: 'full-height',
		load : function(el){
		   this.setHeight(el, function(height){
			   console.log('OK callback called-' + height);
		   });
		   /*
		    * add window.resize event listener
		    */
		   var moduleObject = this;
		   $(window).resize(function(){
			   moduleObject.setHeight(el,function(height){
				   console.log('OK callback called-' + height);
			   });
		   });
		},
		setHeight : function(n, cb){
		   console.log(n.nodeName);
		   if(n.nodeName.toLowerCase() == 'body') cb($(window).height());
		   else {
			   this.setHeight(n.parentNode, function(height){
				   var siblingHeight = 0;
				   var s = $(n).offset().top;
				   var e = s + $(n).outerHeight();
				   $(n).siblings().each(function(){
					   var ss = $(this).offset().top;
					   if( ss < s || ss >= e) siblingHeight += $(this).outerHeight();
//						   console.log('>>'+$(this).attr('id') +":" +  ss + " - " + s + "/" + e + " " + siblingHeight);
				   });
				   var res = height - siblingHeight;
				   $(n).outerHeight(res);
				   cb($(n).height());
			   });
		   }
		}
	});
	Sejak.ctx.stylers.push(new styleFullHeight() );
	
	/*
	 * sj-layout-horizontal
	 */
	var styleLayoutHorizontal = Sejak.extends(SejakStylers, {
		name: 'layout-horizontal',
		load : function(el){
		   $(el).children().each(function(){
			   $(this).css('display', 'inline-block');
			   $(this).css('vertical-align', 'top');
		   });
		   $(window).trigger('resize');
	   }
	});
	Sejak.ctx.stylers.push(new styleLayoutHorizontal() );
})();