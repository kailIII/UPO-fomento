app.view.IndicatorList = Backbone.View.extend({
    _template : _.template( $('#indicator_list_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 1);
        this.render();
        
       
        
    },
    
    events:{
    	"click .familia" : "clickFamilia"
    },
    
    clickFamilia:function(e){
    	if($(e.currentTarget).next().is(":visible")){
    		$(e.currentTarget).next().slideUp();
    	}else{
    		$(e.currentTarget).next().slideDown();
    	}
    	
    },
    
    onClose: function(){
        // Remove events on close
    	this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
    
});



