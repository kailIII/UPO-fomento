app.model.Family = Backbone.Model.extend({
	
	url:null,
	
    defaults:{
    	cod_familia: null,
    	cod_indicador: null,
    	name_familia: null,
    	name_indicador: null,
    	count: null,
    	fecha:null
    },
    
    initialize: function(attrs, options) {
    },
    
    url: function() {
        return this.url;
    }
  
});