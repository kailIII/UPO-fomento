app.view.Indicator = Backbone.View.extend({
    _template : _.template( $('#indicator_template').html() ),
//    idIndicador: null,
    
    initialize: function(options) {
//    	if(options.esIndicador){
//    		app.events.trigger("menu", 1);
//    	}else{
//    		app.events.trigger("menu", 4);
//    	}
    	this.indicadorActual = options.idIndicador;
    	this.fecha = options.fecha;
    	this.id_geometry = options.id_geometry; 
//    	this.fecha = options.fecha;
//    	this.esIndicador = options.esIndicador;
    	this.numIndicadores = 1;
    	this.render();
    },
    
    events:{
    	"click .botonDesplegable": "botonDesplegableClick",
    	"click .botonLeyenda": "botonLeyendaClick",
    	"click .botonVolver": "goList",
//    	"change .comboFechas select" : "changeDate",
//    	"click #anteriorIndicador" : "anteriorIndicador",
//    	"click #siguienteIndicador" : "siguienteIndicador",
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
    
//    changeDate:function(e){
//    	this.drawIndicator(this.$el.find("#idIndicador").val(),e.currentTarget.value);
//    },
    
    goList:function(){
    	app.router.navigate('indicadores', {trigger: true});
    },
    
//    anteriorIndicador:function(){
//    	if(this.indicadorActual == 1){
//    		this.indicadorActual = this.numIndicadores;
//    	}else{
//    		this.indicadorActual -= 1;
//    	}
//    	this.drawIndicator(this.indicadorActual, this.fecha);
//    },
    
//    siguienteIndicador:function(){
//    	if(this.indicadorActual == this.numIndicadores){
//    		this.indicadorActual = 1;
//    	}else{
//    		this.indicadorActual += 1;
//    	}
//    	this.drawIndicator(this.indicadorActual, null);
//    },
    
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
        
        $.ajax({
			url : "/api/indicador_data/" + this.indicadorActual + "/" + this.fecha,
			type: "GET",			
	        success: function(response) {
	        	self.$el.find(".title2").text(response.name_familia)
	        	self.$el.find(".title3").text(response.name_indicador)
	        	var keys = Object.keys(response.datos[0]);
	        	var col = Math.floor(12/(keys.length-1));
	        	self.$el.find(".cabeceraTabla").html("");
	        	$.each(keys, function(i,key){
	        		if(i!=0){
	        			self.$el.find(".cabeceraTabla").append("<div class='col-sm-" + col +  " col-md-" + col + "'>"+
								"<p>" + key.replace("###"+ (i) + "###", "") +"</p>" +
							"</div>");
	        		}
	        		
	        	});
	        	
	        	self.$el.find(".datosTabla").html("");
	        	$.each(response.datos, function(i, dato){
	        		var row = "<div class='row datos' geom='" + dato[keys[0]] + "'>"
	        		for(var i=0; i<keys.length; i++){
	        			if(i!=0){
	        				row += "<div class='col-sm-" + col +  " col-md-" + col + "'>" +
    									"<p>" + dato[keys[i]] + "</p>" +
    								"</div>";
	        			}
	        		}
	        		row += "</div>";
	        		self.$el.find(".datosTabla").append(row);
	        	});
	        	
	        	if(self.id_geometry){
	        		$(".datosTabla").find(".datos[geom='"+ self.id_geometry + "']").addClass("active");
	        		$('.datosTabla').animate({
    			        scrollTop: $($(".datosTabla").find(".active")[0]).offset().top-180
    			    }, 1000);
	        	}
	        },
	    });
        
        return this;
    }
    
});