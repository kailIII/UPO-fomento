app.view.Family = Backbone.View.extend({
    _template : _.template( $('#family_list_template').html() ),
    
    initialize: function(options) {
    	
    	var families = new app.model.Families();
        this.tipo = options.tipo;
    	if(this.tipo == 1){
    		app.events.trigger("menu", 1);
            $("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>USOS DE SUELO")
    	}else if(this.tipo == 2){
    		app.events.trigger("menu", 4);
    		// families.url = "/api/cartoTem"
            $("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>MOVILIDAD")
    	}else if(this.tipo == 3){
            app.events.trigger("menu", 5);
            // families.url = "/api/cartoTem"
            $("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>CENTROS DE ACTIVIDAD")
        }else{
            app.events.trigger("menu", 6);
            // families.url = "/api/mapBase"
            $("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>CARTOGRAFÍA BASE")
        }

        families.url = "/api/mapBaseTipo/" + this.tipo
    	
    	families.fetch({reset:true});
    	this.listenTo(families, "reset", this.loadFamilies);
//        this.render();
        
       
        
    },
    
    events:{
    	"click .familia" : "clickFamilia",
    	"click .botonDesplegable": "botonDesplegableClick",
    	"click .botonLeyenda": "botonLeyendaClick",
    	"click .indicador": "goToIndicador",
        "click .indicatorInfo": "indicatorInfo",
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
//    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_ocultar-lista.png");
    		$(e.currentTarget).text("Mostrar leyenda");
    	}else{
    		$(".leyenda").fadeIn();
//    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_mostrar-lista.png");
    		$(e.currentTarget).text("Ocultar leyenda");
    	}
    },
    
    goToIndicador:function(e){
        var id = $(e.currentTarget).attr("IdIndicador");
        var load = true;
        var layers = this.tipo == 1 ? Map.getLayersIndicador():Map.getLayersMapBase();
        for(var i=0; i<layers.length; i++){
            if(layers[i].id == id){
                load = false;
                break;
            }
        }
        
        if(load){
            restoreMap();
            Map.drawIndicator(id,null, this.tipo == 1? true:false);
            Map.getMap().setZoom(8);
        }
//    	app.showView(new app.view.Indicator({idIndicador:$(e.currentTarget).attr("IdIndicador") , fecha:null, esIndicador:this.esIndicador}));
//    	app.router.navigate('indicador/'+ $(e.currentTarget).attr("IdIndicador"), {trigger: true});
    },

    indicatorInfo:function(e){
        var descrip = $(e.currentTarget).parent().find(".indicatorDescription");
        if(descrip.is(":visible")){
            descrip.slideUp();
        }else{
            descrip.slideDown();
        }
        e.stopImmediatePropagation()
    },
    
    onClose: function(){
        // Remove events on close
    	this.stopListening();
    },
    
    loadFamilies : function(response) {
    	this.$el.html(this._template({families:response.toJSON()}));

        if(this.tipo == 1){
            this.$el.find("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>USOS DE SUELO")
        }else if(this.tipo == 2){
            this.$el.find("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>MOVILIDAD")
        }else if(this.tipo == 3){
            this.$el.find("#tituloListadoFamilias").html("<strong>FAMILIA / </strong>CENTROS DE ACTIVIDAD")
        }else{
            this.$el.find("#tituloListadoFamilias").html("CARTOGRAFÍA BASE")
        }

    	if(Backbone.history.fragment != ""){
    		$(".botonDesplegable").trigger("click");
    	}
	},
    
//    render: function() {
//        this.$el.html(this._template());
//        return this;
//    }
    
});



