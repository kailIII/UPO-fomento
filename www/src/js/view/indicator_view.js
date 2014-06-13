app.view.Indicator = Backbone.View.extend({
    _template : _.template( $('#indicator_template').html() ),
//    idIndicador: null,
    
    initialize: function() {
    	app.events.trigger("menu", 1);
        this.render();
    },
    
    events:{
    	"click .botonDesplegable": "botonDesplegableClick",
    	"click .botonLeyenda": "botonLeyendaClick",
    	"click .botonVolver": "goList"
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
    
    goList:function(){
    	app.router.navigate('indicadores', {trigger: true});
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());        
        return this;
    },
    
    drawIndicator:function(idIndicador, fecha){
        var self = this;
        $.ajax({
			url : "/api/indicador/" + idIndicador + "/" + (fecha!=null ? fecha:""),
			type: "GET",			
	        success: function(response) {
	        	self.$el.find(".title2").text(response.name_familia)
	        	self.$el.find(".title3").text(response.name_indicador)
	        	var keys = Object.keys(response.datos[0]);
	        	var col = Math.floor(12/keys.length);
	        	var capas = $.parseJSON(response.capas);
	        	self.$el.find(".cabeceraTabla").html("");
	        	$.each(keys, function(i,key){
	        		self.$el.find(".cabeceraTabla").append("<div class='col-sm-" + col +  " col-md-" + col + "'>"+
	        													"<p>" + key.replace("###"+ (i+1) + "###", "") +"</p>" +
	        												"</div>");
	        	});
	        	
	        	self.$el.find(".datosTabla").html("");
	        	$.each(response.datos, function(i, dato){
	        		var row = "<div class='row datos'>"
	        		for(var i=0; i<keys.length; i++){
	        			row += "<div class='col-sm-" + col +  " col-md-" + col + "'>" +
	        						"<p>" + dato[keys[i]] + "</p>" +
	        					"</div>";
	        		}
	        		row += "</div>";
	        		self.$el.find(".datosTabla").append(row);
	        	});
	        	
	        	Map.removeAllLayers();
	        	
	        	for(var i=0; i<capas.capas.length; i++){
	        		var layer = L.tileLayer.wms(capas.capas[i].servidor, {
	    				layers: capas.capas[i].capa,
	    				format: 'image/png',
	    				transparent: true
	    			});	
	        		Map.getLayers().push(layer);
	        		layer.addTo(Map.getMap());
	        	}
	        	response.fechas = response.fechas.sort()
	        	for(var i=0; i<response.fechas.length; i++){
	        		$(".comboFechas").find("select").append("<option " + (response.fecha == response.fechas[i] ? "selected": '') + ">" + response.fechas[i] + "</option>");
	        	}
	        },
	    });
    }
    
});