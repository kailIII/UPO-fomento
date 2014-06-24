app.view.Indicator = Backbone.View.extend({
    _template : _.template( $('#indicator_template').html() ),
//    idIndicador: null,
    
    initialize: function() {
    	app.events.trigger("menu", 1);
    	this.indicadorActual = 1;
    	this.numIndicadores = 1;
    	this.render();
    },
    
    events:{
    	"click .botonDesplegable": "botonDesplegableClick",
    	"click .botonLeyenda": "botonLeyendaClick",
    	"click .botonVolver": "goList",
    	"change .comboFechas select" : "changeDate",
    	"click #anteriorIndicador" : "anteriorIndicador",
    	"click #siguienteIndicador" : "siguienteIndicador",
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
//    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_ocultar-lista.png");
    		$(e.currentTarget).text("Mostrar leyenda");
    	}else{
    		$(".leyenda").fadeIn();
//    		$(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_mostrar-lista.png");
    		$(e.currentTarget).text("Ocultar leyenda");
    	}
    },
    
    changeDate:function(e){
    	this.drawIndicator(this.$el.find("#idIndicador").val(),e.currentTarget.value);
    },
    
    goList:function(){
    	app.router.navigate('indicadores', {trigger: true});
    },
    
    anteriorIndicador:function(){
    	if(this.indicadorActual == 1){
    		this.indicadorActual = this.numIndicadores;
    	}else{
    		this.indicadorActual -= 1;
    	}
    	this.drawIndicator(this.indicadorActual, null);
    },
    
    siguienteIndicador:function(){
    	if(this.indicadorActual == this.numIndicadores){
    		this.indicadorActual = 1;
    	}else{
    		this.indicadorActual += 1;
    	}
    	this.drawIndicator(this.indicadorActual, null);
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        var self = this;
        $.ajax({
    		url : "/api/numIndicadores",
  			type: "GET",			
  	        success: function(response) {
  	        	self.numIndicadores = response.result;
  	        }
    	});
        return this;
    },
    
    drawIndicator:function(idIndicador, fecha){
        var self = this;
        self.$el.find("#idIndicador").val(idIndicador);
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
	        	
	        	if(response.leyenda != null){
	        		$(".leyenda").html("<img src='" + response.leyenda + "'>");
	        	}else{
	        		$(".leyenda").html("");
	        	}
	        	
	        	
	        	response.fechas = response.fechas.sort();
	        	$(".comboFechas").find("select").html("");
	        	for(var i=0; i<response.fechas.length; i++){
	        		$(".comboFechas").find("select").append("<option " + (response.fecha == response.fechas[i] ? "selected": '') + ">" + response.fechas[i] + "</option>");
	        	}
	        	
	        	//Actualizo el árbol de capas
	        	$(".indicatorName").text(response.name_indicador);
	        },
	    });
    }
    
});