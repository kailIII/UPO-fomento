app.view.Service = Backbone.View.extend({
    _template : _.template( $('#service_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 2);
        this.render();
        
        this.clientText = new ZeroClipboard( this.$el.find("img"), {
    	    moviePath: "../lib/zeroclipboard/ZeroClipboard.swf",
    	    debug: false
    	} );
        
    },
    
    events:{
    	"click img": "copyUrl",
    },
    
    
    copyUrl:function(e){    		
    	this.$el.find("img").attr("src", "/img/TITA-fomento_icon_url.png");
        $(e.currentTarget).attr("src", "/img/TITA-fomento_icon_url_copiada.png");
    },
    
    onClose: function(){
        // Remove events on close
    	this.clientText.destroy();
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
    
});



