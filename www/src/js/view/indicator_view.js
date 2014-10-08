app.view.Indicator = Backbone.View.extend({
    _template: _.template($('#indicator_template').html()),

    initialize: function(options) {
        this.indicadorActual = options.idIndicador;
        this.fecha = options.fecha;
        this.id_geometry = options.id_geometry;
        this.multiYear = options.multiYear;
        this.numIndicadores = 1;
        this.graphics = [];
        this.graphicsImage = [];
        this.graphicsProperties = [];
        this.render();
    },
    events: {
        "click .botonDesplegable": "botonDesplegableClick",
        "click .botonLeyenda": "botonLeyendaClick",
        "click .botonVolver": "goList",
        "click .conmutador_representacion a": "tabular",
        "click .ampliarView": "ampliarView",
        "click .datos": "goMap",
    },
    botonDesplegableClick: function(e) {
        if ($(".indicator").is(":visible")) {
            $(".indicator").fadeOut();
            $(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_mostrar-lista.png");
        } else {
            $(".indicator").fadeIn();
            $(e.currentTarget).find("img").attr("src", "/img/TITA-fomento_icon_ocultar-lista.png");
        }
    },

    goList: function() {
        app.router.navigate('indicadores', {trigger: true});
    },
    
    tabular: function(e) {
    	if(!$(e.currentTarget).hasClass("active")){
    		$(".conmutador_representacion").find("a").removeClass("active");
        	$(e.currentTarget).addClass("active");
        	if($(e.currentTarget).index() == 0){
        		$('.zonaIndicador').show();
                $('#zonaChart').hide();
        	}else{
        		 $('.zonaIndicador').hide();
                 $('#zonaChart').show();
                 $("#zonaChart").resize();
        	}
    	}
    	
    },

    onClose: function() {
        // Remove events on close
        this.stopListening();
    },
    
    drawChart: function(self) {
        // var self = this;
        $("#zonaChart").html("");
        
        for(var i=0; i<self.graphicsImage.length; i++){
            $("#zonaChart").append("<img style='margin-top: 70px;' src='" + self.graphicsImage[i] +"'>");    
        }
            for(var i=0; i<self.graphics.length;i++){
                    $("#zonaChart").append("<div class='chart" + i + "'></div>")
                    var googleData = google.visualization.arrayToDataTable(self.graphics[i]);
                    var options = {
                        title: self.graphicsProperties[i].title,
                        width:$(".contenido").outerWidth(),
                        height:$(".contenido").outerHeight(),
                        legend: { position: 'top', alignment: 'start' },
                        // chartArea: {  width: "50%"}
                    };
                    var chart = new window["google"]["visualization"][self.graphicsProperties[i].type]($(".chart" + i)[0]);
                    chart.draw(googleData, options, null);
                }
    },
    
    ampliarView:function(e){
    	if($(e.currentTarget).prop("title") == "Ampliar"){
            this.width = $(".cabeceraTabla").width();
    		$(".contenido").css({"right":"0"});
        	$(e.currentTarget).css({"left":"97%"});
        	$(e.currentTarget).attr("src","/img/TITA-fomento_icon_menos.png");
        	$(e.currentTarget).prop("title","Disminuir");
        	
        	if($(".cuerpoIndicador").outerWidth() > this.width){
        		$(".cabeceraTabla").css({"width":""})
            	$(".datosTabla").css({"width":""})
        	}
        	
    	}else{
    		$(".contenido").css({"right":""});
        	$(e.currentTarget).css({"left":""});
        	$(e.currentTarget).attr("src","/img/TITA-fomento_icon_mas.png");
        	$(e.currentTarget).prop("title","Ampliar");
        	
        	$(".cabeceraTabla").css({"width":this.width})
        	$(".datosTabla").css({"width":this.width})
    	}
        this.drawChart(this);
    },
    
    goMap:function(e){
    	var id_geom = $(e.currentTarget).attr("geom");
    	$(".datos.active").removeClass("active");
    	$(e.currentTarget).addClass("active");
    	$.ajax({
            url: "/api/centroid/" + this.tablaGeom + "/" + this.colGeom + "@" + id_geom,
            type: "GET",
            success: function(response) {
            	Map.getMap().setView([response.lat, response.lng], 10);
            }
        });
    
    },

    render: function() {
        this.$el.html(this._template());
        var self = this;
        this.$el.find(".conmutador_representacion").hide();
        
        $.ajax({
            url: "/api/indicador_data/" + this.indicadorActual + "/" + this.fecha,
            type: "GET",
            success: function(response) {
                self.$el.find(".title2").text(response.name_familia)
                self.$el.find(".title3").text(response.name_indicador)
                var keys = Object.keys(response.datos[0]);
                var col = Math.floor(12 / (keys.length - 1));
                self.$el.find(".cabeceraTabla").html("");

                $(".leyenda").html("");
                if (response.leyendas != null) {
                    var leyendas = response.leyendas.split(",");
                    for(var i=0; i<leyendas.length; i++){
                        $(".leyenda").append("<img src='/img/leyendas/" + leyendas[i] + "'>");
                    }
                }
                var width = response.width;
                $.each(keys, function(i, key) {
                    if (i != 0) {
                    	self.$el.find(".cabeceraTabla").css({"width": width})
                        self.$el.find(".cabeceraTabla").append("<div class='fleft mr ml' style='width:" + (100/(keys.length)) + "%;'>" +
                                "<p>" + key.replace(/[\#]*[0-9]*[\#]*/, '') + "</p>" +
                                "</div>");

                    }

                });

                self.$el.find(".datosTabla").html("");
                $.each(response.datos, function(i, dato) {
                    var row = "<div class='row datos' geom='" + dato[keys[0]] + "'>"
                    for (var i = 0; i < keys.length; i++) {
                        if (i != 0) {
                        	self.$el.find(".datosTabla").css({"width": width})
                            row += "<div class='fleft mr ml' style='width:" + (100/(keys.length)) + "%;'>";
                        	
                            row += "<p>" + dato[keys[i]] + "</p>" +
                                    "</div>";
                        }
                    }
                    row += "</div>";
                    self.$el.find(".datosTabla").append(row);
                });

                if (self.id_geometry) {
                    $(".datosTabla").find(".datos[geom='" + self.id_geometry + "']").addClass("active");
                    $('.datosTabla').animate({
                        scrollTop: $($(".datosTabla").find(".active")[0]).offset().top - 180
                    }, 1000);
                }
                
                self.tablaGeom = response.tabla_geom.split("###")[0];
                self.colGeom = response.tabla_geom.split("###")[1];
            }
        });

        $.ajax({
            url: "/api/indicador_graphics/" + this.indicadorActual + "/" + this.fecha,
            type: "GET",
            success: function(response) {
                self.graphics = [];
                self.graphicsProperties = [];
                if(!jQuery.isEmptyObject(response)){
                    self.$el.find(".conmutador_representacion").fadeIn();
                }
                $.each(response, function(key){
                    if(response[key].properties.type == "image"){
                        self.graphicsImage.push(response[key].imagen);
                    }else{
                        self.graphicsProperties.push(response[key].properties);
                        var data = response[key].data;
                        var arrayData = [];
                        for(var i=0; i<data.length; i++){
                            if(i==0){
                                var keys = Object.keys(data[i]);
                                for(var y=0;y<keys.length;y++){
                                    keys[y] = keys[y].replace(/[\#]*[0-9]*[\#]*/, '')
                                }
                                arrayData.push(keys);
                            }
                            var aux = [];
                            $.each(data[i], function (index, value) {
                                aux.push(value)
                            });
                            arrayData.push(aux);
                        }
                        self.graphics.push(arrayData);
                 }

                });
                google.load("visualization", "1", { callback: function() { self.drawChart(self);}, packages: ["corechart"] });
            }
        });

        $(window).unbind().bind('resize', function (event) {
            self.drawChart(self);
        });

        return this;
    }

});