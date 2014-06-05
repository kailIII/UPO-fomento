app.view.Project = Backbone.View.extend({
    _template : _.template( $('#project_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 3);
        this.render();
    },
    
    events:{
    	
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



