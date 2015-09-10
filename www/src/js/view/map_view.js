app.view.Map = Backbone.View.extend({
    
    initialize: function() {
    	Map.initialize();

        $("#print").click(function(event) {
            window.print();
        });

//    	this.render();
    },
    
    events:{
        
	},
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
    	
        return this;
    },
    
    
   
    
});

	