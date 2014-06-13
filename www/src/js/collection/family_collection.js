app.model.Families = Backbone.Collection.extend({
	model: app.model.Family,
	
	url: function() {
        return "/api/families";
    },
    
    parse: function(response){
        return response.result;
     }
    
});