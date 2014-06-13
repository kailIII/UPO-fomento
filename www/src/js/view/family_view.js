app.view.Family = Backbone.View.extend({
    _template : _.template( $('#family_list_template').html() ),
    
    initialize: function() {
    	app.events.trigger("menu", 1);
    	
    	var families = new app.model.Families();
    	families.fetch({reset:true});
    	this.listenTo(families, "reset", this.loadFamilies);
//        this.render();
        
       
        
    },
    
    events:{
    	"click .familia" : "clickFamilia",
    	"click .botonDesplegable": "botonDesplegableClick",
    	"click .botonLeyenda": "botonLeyendaClick",
    	"click .indicador": "goToIndicador",
    },
    
    botonDesplegableClick:function(e){
    	if($(".indicatorList").is(":visible")){
    		$(".indicatorList").fadeOut();
    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_mostrar-lista.png");
    	}else{
    		$(".indicatorList").fadeIn();
    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_ocultar-lista.png");
    	}
    },
    
    clickFamilia:function(e){
    	if($(e.currentTarget).next().is(":visible")){
    		$(e.currentTarget).next().slideUp();
    	}else{
    		$(e.currentTarget).next().slideDown();
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
    
    goToIndicador:function(e){
    	app.router.navigate('indicador/'+ $(e.currentTarget).attr("IdIndicador"), {trigger: true});
    },
    
    onClose: function(){
        // Remove events on close
    	this.stopListening();
    },
    
    loadFamilies : function(response) {
    	this.$el.html(this._template({families:response.toJSON()}));
	},
    
//    render: function() {
//        this.$el.html(this._template());
//        return this;
//    }
    
});



