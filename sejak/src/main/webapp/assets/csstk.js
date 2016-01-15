var csstk = {
	cssStack : [],
	cssListStack : [],
	currentListStack : [],
	findEndof :	function(str, s){
		var o=0;
		for(var idx=s+1; idx<str.length; idx++){
			if(str.charAt(idx) == '}'){
				if(o == 0) return idx;
				o--;
			}
			else if(str.charAt(idx) == '{') o++;
		}
		return -1;
	},
	parseBlock : function(str){
		
		var result = '';
		
		var f = str.indexOf('{');
		var e = this.findEndof(str, f);
		if(e == -1){
			console.log('error-parse');
			return;
		}
		var v = str.substring(0, f).trim();
		var b = str.substring(f+1, e).trim();

		/* sub---B
		 */
		this.cssStack.push(v);
		var s=0;
		for(var idx=s; idx<b.length; idx++){
			var c = b.charAt(idx);
			if(c == '{') break;
			if(c == ';'){
				var l = b.substring(s, idx+1);
				this.currentListStack.push(l.trim());
				s = idx+1;
			}
		}
		if(s>0) b=b.substring(s);
		if(!(b.length==0 || b.trim().length==0)){
				
			/*
			 * goto child-nodes
			 */
	  		this.cssListStack.push(this.currentListStack.valueOf());
	  		this.currentListStack = [];
			result += this.parseBlock(b);
			this.currentListStack = this.cssListStack.pop();
		}
			
		/*
		 * make result for this node
		 *----------------------------------------
		 */
		var av = this.cssStack.pop();
		var sbuf='';
		for(var cs in this.cssStack) sbuf += this.cssStack[cs]+" "; sbuf += av + " {\n";
		for(var l in this.currentListStack) sbuf += ("\t"+this.currentListStack[l]+"\n");	
		sbuf += ("}\n");
		result += sbuf;
			
		/*
		 * goto sibling
		 *---------------------------------
		 */
		str = str.substring(e+1).trim();
		if(str.length > 0){
			this.currentListStack = [];
			result += this.parseBlock(str);
		}
		
		return result;
	}
};	

