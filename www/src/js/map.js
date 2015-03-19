Map = {
	
	layerIndicador:null,
	iniLat: 40.3125504961318,
	iniLng: -3.69644646621596,	
	iniZoom: 6,
	__map:null,
	__layersIndicador:[],
	__layersMapBase:[],
	
	initialize: function(){
//			// center the map
			var startingCenter = new L.LatLng(this.iniLat, this.iniLng);		
			
//			//create the left map's leaflet instance
			this.__map = new L.Map('map', {
				  center: startingCenter,
				  zoom: this.iniZoom,
				  fadeAnimation: false,
				  zoomControl: false,
				  attributionControl: true
			});
			
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.__map);
			
//			app.base = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
//				layers: "andalucia,andalucia_poly,am_centroid_fuera,areas_metropolitanas",
//				format: 'image/png',
//				transparent: true
//			});
//			app.base.setZIndex(0);
//			app.base.addTo(this.__map);
//			
//			app.layerRelieve = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
//				layers: "relieve_2,andalucia,am_centroid_fuera,areas_metropolitanas",
//				format: 'image/png',
//				transparent: true
//			});
//			
//			app.layerRelieve.setZIndex(1);
//			app.layerRelieve.addTo(this.__map);
			
			app.base = "espana";
			app.baseRelieve = "relieve";
			
			app.baseLayer = L.tileLayer.wms("http://tita.geographica.gs/geoserver/movitra_fondo_cartografico/wms?", {
				layers: app.baseRelieve,
				format: 'image/png',
				transparent: true,
				zIndex:0
			});

			new L.SingleTileWMSLayer("http://tita.geographica.gs/geoserver/movitra_fondo_cartografico/wms?", 
							{
								layers: "areas_metropolitanas_centroid_fuera",
								format: 'image/png',
								transparent: true,
								zIndex:0,
							}).addTo(this.__map);

			app.baseLayer.addTo(this.__map);
			
			//ARREGLAR ESTO
			
			app.basePoly = L.tileLayer.wms("http://tita.geographica.gs/geoserver/movitra_fondo_cartografico/wms?", {
				layers: "areas_metropolitanas",
				format: 'image/png',
				transparent: true,
				zIndex:10000000000
			});
			app.basePoly.addTo(this.__map);
			
			//////////////////

			// add zoom control to map left
			var zoomControl = new L.Control.Zoom({
				position : 'bottomright'
			});		
		
			zoomControl.addTo(this.__map);
		
//			this.__map.touchZoom.disable();
	},

	getMap: function() {
		return this.__map;
	},
	
	getLayersIndicador: function() {
		return this.__layersIndicador;
	},
	
	getLayersMapBase: function() {
		return this.__layersMapBase;
	},
	
	removeAllIndicatorLayers: function() {
		var self = this;
		$.each(this.__layersIndicador, function(i){
//			for(var y=0; y<self.__layersIndicador[i].capa.length; y++){
//				self.getMap().removeLayer(self.__layersIndicador[i].capa[y]);
//			}
			self.getMap().removeLayer(self.__layersIndicador[i].capa);
		});
		this.__layersIndicador = [];
	},
	
	refreshIndex: function() {
		var self = this;
		var aux = 3;
		$.each(this.__layersIndicador, function(i){
//			for(var y=0; y<self.__layersIndicador[i].capa.length; y++){
//				self.__layersIndicador[i].capa[y].setZIndex(y+2+i);
//				aux ++;
//			}
			self.__layersIndicador[i].capa.setZIndex(aux);
			aux ++;
		});
		
		$.each(this.__layersMapBase, function(i){	
//			for(var y=0; y<self.__layersMapBase[i].capa.length; y++){
//				self.__layersMapBase[i].capa[y].setZIndex(aux);
//				aux++;
//			}
			self.__layersMapBase[i].capa.setZIndex(aux);
			aux++;
		});
	},
	
	
	drawIndicator:function(idIndicador, fecha, esIndicador){
        var self = this;
        $.ajax({
			url : "/api/indicador/" + idIndicador + "/" + (fecha!=null ? fecha:""),
			type: "GET",			
	        success: function(response) {
	        	var capas = $.parseJSON(response.capas);
	        	
	        	if(esIndicador){
	        		Map.removeAllIndicatorLayers();
	        	}
	        	
	        	if(!response.hasOwnProperty("row_centroids")){
		        	var aux = "";
		        	for(var i=0; i<capas.capas.length; i++){
		        		aux += capas.capas[i].capa + ",";
		        	}
		        	aux = aux.slice(0,-1);
		        	
		        	if(response.single_tile){
		       //  		var layer = new L.SingleTileWMSLayer(capas.capas[0].servidor, {
		    			// 	layers: aux,
		    			// 	format: 'image/png',
		    			// 	transparent: true,
		    			// });
						var layer = L.tileLayer.wms(capas.capas[0].servidor, {
		    				layers: aux,
		    				format: 'image/png',
		    				transparent: true,
		    				tileSize:($("#map").width() > $("#map").height() ? $("#map").width() : $("#map").height())
		    			});

		        	}else{
			        	var layer = L.tileLayer.wms(capas.capas[0].servidor, {
		    				layers: aux,
		    				format: 'image/png',
		    				transparent: true,
		    			});
		        	}
		        	
		        	layer.addTo(Map.getMap());

	        	}else{
	        		var options = 	{
	        							"centroids" : response.row_centroids,
	        							"styles" : $.parseJSON(response.capas),
	        							"title" : response.name_indicador,
	        							"fecha" : response.fecha,
	        							"uni": response.uni
	        						};

	        		layer = new L.GSFlowLayers(options);
	        		Map.getMap().addLayer(layer);
	        		
	       //  		var styleLine = {color: 'green', weight: 5};
    				// var styleLine2 = {color: 'red', weight: 5};
    				// var initialStyle = {radius: 5,fillColor: "white",color: "green",weight: 1,opacity: 1,fillOpacity: 1};
    				// var finalStyle = {radius: 5,fillColor: "green",color: "white",weight: 1,opacity: 1,fillOpacity: 1};
    				// var layer = L.layerGroup();
    				// for(var i=0; i<response.row_centroids.length; i++){
    				// 	layer.addLayer(new L.GSFlowLayer("id","title","valor",[response.row_centroids[i].lat_origen,response.row_centroids[i].lng_origen],[response.row_centroids[i].lat_destino,response.row_centroids[i].lng_destino],styleLine, initialStyle, finalStyle, null, null, styleLine2));
    				// }
    				// Map.getMap().addLayer(layer);

    				// var layer = new L.GSFlowLayer("id","title","valor",[37.12090636165327,-5.537109374999999],[37.95286091815649,-3.2135009765625],styleLine, initialStyle, finalStyle, null, null, styleLine2);
    				// Map.getMap().addLayer(layer);
	        	}
	        	
	        	if(esIndicador){
        			Map.getLayersIndicador().push({"id":response.cod_indicador, capa:layer});
        		}else{
        			Map.getLayersMapBase().push({"id":response.cod_indicador, capa:layer});
        		}
	        	
	        	Map.refreshIndex();
	        	
	        	if(response.leyenda != null){
	        		$(".leyenda").append("<div idIndicador=" + idIndicador + "><img src='/img/leyendas/" + response.leyenda + "'></div>");
	        	}else{
	        		// $(".leyenda").html("");
	        	}
	        	
	        	
	        	response.fechas = response.fechas.sort();
	        	var fechas;
	        	if(response.tipocheck){
	        		fechas = "<div class='fright ml30'>"
	        		for(var i=0; i<response.fechas.length; i++){
	        			fechas += "<input " + ((response.fechas[i]==fecha || (fecha == null && i==0)) ? "checked":"") +  " class='fleft' style='margin-top:12px;' type='checkbox'/><label class='fleft'>" + response.fechas[i] + "</label>"
	        		}
	        		fechas += "</div>"
	        		if($(fechas).find(":checked").length == 0){

	        		}
	        	}else{
	        		fechas = "<select class='comboFechas'>";
		        	for(var i=0; i<response.fechas.length; i++){
		        		fechas += ("<option " + (response.fecha == response.fechas[i] ? "selected": '') + ">" + response.fechas[i] + "</option>");
		        	}
		        	fechas += "</select>";
	        	}
	        	
	        	
	        	//Actualizo el árbol de capas
	        	if(esIndicador){
	        		$(".indicatorName").text(response.name_indicador);
	        		$("#groupLayer").find("h1").find("select").remove()
	        		$(".indicatorName").append("<img class='borrarCapa' title='Eliminar' src='/img/TITA_icon_descartar_capa.svg'>");
	        		$(".indicatorName").append("<div class='featureInfo' title='Herramienta de información'><p>i</p></div>");
	        		$(".indicatorName").append(fechas);
	        		$(".indicatorName").attr("idIndicador", response.cod_indicador);
	        	}else{
	        		$(".mapaBaseList").prepend("<div idIndicador='" + response.cod_indicador + "' class='capa'> " + response.name_indicador + "<img class='borrarCapa' title='Eliminar' src='/img/TITA_icon_descartar_capa.svg'><div class='featureInfo' style='padding-left: 6px;margin-top: 9px;' title='Herramienta de información'><p style='margin-top: -9px;'>i</p></div>" +  fechas + "</div>");
	        	}
	        	
	        	groupLayerEvents();
	        },
	    });
    },

    drawIndicatorLayer:function(id, fechas, esIndicador){
    	$.ajax({
			url : "/api/indicador_capas/" + id + "/" + fechas,
			type: "GET",
			success: function(response) {
				var layers = esIndicador ? Map.getLayersIndicador():Map.getLayersMapBase();
				var aux = "";
				for(var i=0; i<layers.length; i++){
					if(layers[i].id == id){
						Map.getMap().removeLayer(layers[i].capa);
						var opacity = layers[i].capa.options.opacity;
						for(var y=0; y<response.result.length; y++){
							var capas = $.parseJSON(response.result[y].capas);
							for(var z=0; z<capas.capas.length; z++){
				        		aux += capas.capas[z].capa + ",";
				        	}
						}
						aux = aux.slice(0,-1);
						var newLayer = L.tileLayer.wms(capas.capas[0].servidor, {
			    				layers: aux,
			    				format: 'image/png',
			    				transparent: true,
			    				opacity:opacity
			    		});	
			        		
			        	newLayer.addTo(Map.getMap());
						layers[i].capa=newLayer;
						Map.refreshIndex();

						break;
					}
				}
			}
		});
    },
    
    featureInfo : function(e,layer, lat, lng){
    	
    	var BBOX = this.__map.getBounds().toBBoxString();
		var WIDTH = this.__map.getSize().x;
		var HEIGHT = this.__map.getSize().y;
		var X = this.__map.layerPointToContainerPoint(e.layerPoint).x;
		var Y = this.__map.layerPointToContainerPoint(e.layerPoint).y;
    	
    	
    	
  //   	if(id == null){
		// 	id = esIndicador? this.__layersIndicador.length-1:this.__layersMapBase.length-1;
		// }
  //   	layers = esIndicador? this.__layersIndicador[id].capa : this.__layersMapBase[id].capa;
  //   	var layersName = "";
    	var request = layer.capa._url + '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=' + layer.capa.options.layers +'&QUERY_LAYERS='+ layer.capa.options.layers +'&STYLES=&BBOX='+BBOX+'&FEATURE_COUNT=5&HEIGHT='+HEIGHT+'&WIDTH='+WIDTH+'&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fhtml&SRS=EPSG%3A4326&X='+X+'&Y='+Y;
    	
    	$.ajax({
			url : "/api/proxy",
			data: { "url": request},	       
			type: "POST",			
	        success: function(data) {
	        	try {
// 		        	if (!data || data.indexOf("LayerNotQueryable")!=-1){
// //		        		obj.featureInfo(e,requestIdx+1);
// 		        	}
// 		        	else{
// 		        		if($.trim($($.parseXML(data)).find("body").html()).length != 0){
// 		        			idIndicador = $($.parseXML(data)).find("id_indicador").text();
// 		        			id_geometry = $($.parseXML(data)).find("id_geometria").text();
// 		        			fecha = $("div[idIndicador='" + idIndicador + "'], h1[idIndicador='" + idIndicador + "']").find("select").val();
		        			
// 		        			if(idIndicador == "" || id_geometry==""){
// 		        				if(id>0){
// 			        				Map.featureInfo(e, id-1, esIndicador, lat, lng);
			        				
// 			        			}else if(!esIndicador){
// 			        				Map.featureInfo(e, null, true, lat, lng);
// 			        			}
// 		        			}else{
// 		        				app.router.navigate('info/'+ idIndicador, {trigger: false});
// 			        			app.showView(new app.view.Indicator({idIndicador:idIndicador, fecha:fecha, id_geometry:id_geometry}));
// 			        			Map.getMap().setView([lat, lng], Map.getMap().getZoom()<10 ? 10: Map.getMap().getZoom());
// 		        			}
// 		        		}else{
// 		        			if(id>0){
// 		        				Map.featureInfo(e, id-1, esIndicador, lat, lng);
// 		        			}else if(!esIndicador){
// 		        				Map.featureInfo(e, null, true, lat, lng);
// 		        			}
// 		        		}
// 		        	}
				if($.trim($($.parseXML(data)).find("body").html()).length != 0){
					var idIndicador = $($($.parseXML(data)).find("id_indicador")[0]).text();
					var  id_geometry = $($($.parseXML(data)).find("id_geometria")[0]).text();
					var multiYear = false;
					var fecha;
					var divIndicator =  $("#groupLayer").find("div[idIndicador='" + idIndicador + "'], h1[idIndicador='" + idIndicador + "']");
					if(divIndicator.find("input[type='checkbox']").length > 0){
						multiYear = true;
						fecha = divIndicator.find("input:checked").map(function() {
						    return $(this).next("label").text();
						}).get().join(",");
					}else{
						fecha = divIndicator.find("select").val();
					}
					// var fecha = $("div[idIndicador='" + idIndicador + "'], h1[idIndicador='" + idIndicador + "']").find("select").val();
					if(idIndicador != "" && id_geometry != ""){
						app.router.navigate('info/'+ idIndicador, {trigger: false});
						app.showView(new app.view.Indicator({idIndicador:idIndicador, fecha:fecha, id_geometry:id_geometry}));
						Map.getMap().setView([lat, lng], Map.getMap().getZoom()<10 ? 10: Map.getMap().getZoom());
					}
				}
									
	        	}catch (ex){
	        		// if(id>0){
        			// 	Map.featureInfo(e, id-1, esIndicador, lat, lng);
        			// }else if(!esIndicador){
        			// 	Map.featureInfo(e, null, true, lat, lng);
        			// }
	        	}
	        },
	        error: function(){	        	
	        	// obj.featureInfo(e,requestIdx+1);
	        }
	    });
    	
    },
}
