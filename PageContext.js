define([
	'dojo/_base/declare'
], function(declare){
	return declare('dojos.PageContext', [], {
		request: null
		,response: null
		,constructor: function(req, res){
			this.request = req;
			this.response = res;
		}
		,getContext: function(){
			return {
				text: this.getText()
			};
		}
		,getText: function(){
			return '';
		}
	});
});