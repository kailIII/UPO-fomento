app.view.Indicator = Backbone.View.extend({
    _template : _.template( $('#indicator_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 1);
        this.render();
    },
    
    events:{
    	"click .botonDesplegable": "botonDesplegableClick",
    	"click .botonLeyenda": "botonLeyendaClick"
    },
    
    botonDesplegableClick:function(e){
    	if($(".indicator").is(":visible")){
    		$(".indicator").fadeOut();
    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_mostrar-lista.png");
    	}else{
    		$(".indicator").fadeIn();
    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_ocultar-lista.png");
    	}
    },
    
    botonLeyendaClick:function(e){
    	if($(".leyenda").is(":visible")){
    		$(".leyenda").fadeOut();
    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_ocultar-lista.png");
    	}else{
    		$(".leyenda").fadeIn();
    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_mostrar-lista.png");
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