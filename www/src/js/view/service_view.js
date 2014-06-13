app.view.Service = Backbone.View.extend({
    _template : _.template( $('#service_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 2);
        this.render();
        
        this.clientText = new ZeroClipboard( this.$el.find(".dataClip"), {
    	    moviePath: "../lib/zeroclipboard/ZeroClipboard.swf",
    	    debug: false
    	} );
        
    },
    
    events:{
    	"click .dataClip": "copyUrl",
    	"click .info, strong": "showInfo",
    },
    
    
    copyUrl:function(e){    		
    	this.$el.find(".dataClip").attr("src", "/img/TITA-fomento_icon_url.png");
        $(e.currentTarget).attr("src", "/img/TITA-fomento_icon_url_copiada.png");
    },
    
    showInfo:function(e){
    	var desc = $(e.currentTarget).siblings(".descripcion");
    	if(desc.length == 0){
    		desc = $(e.currentTarget).parent().siblings(".descripcion");
    	}
    	if($(desc).is(":visible")){
    		$(desc).slideUp();
    	}else{
    		$(desc).slideDown();
    	}
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



