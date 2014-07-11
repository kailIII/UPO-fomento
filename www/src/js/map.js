Map = {
	
	layerIndicador:null,
	iniLat: 37.36455,
	iniLng: -4.57645,	
	iniZoom: 8,
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
			
			app.base = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
				layers: "andalucia,andalucia_poly,am_centroid_fuera,areas_metropolitanas",
				format: 'image/png',
				transparent: true
			});
			app.base.setZIndex(0);
			app.base.addTo(this.__map);
			
			app.layerRelieve = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
				layers: "relieve_2,andalucia,am_centroid_fuera,areas_metropolitanas",
				format: 'image/png',
				transparent: true
			});
			
			app.layerRelieve.setZIndex(1);
			app.layerRelieve.addTo(this.__map);
			
			//ARREGLAR ESTO
			
			L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
				layers: "areas_metropolitanas_poly",
				format: 'image/png',
				transparent: true,
				zIndex:10000000000
			}).addTo(this.__map);
			
			//////////////////

			// add zoom control to map left
			var zoomControl = new L.Control.Zoom({
				position : 'bottomright'
			});		
		
			zoomControl.addTo(this.__map);
		
//			this.__map.touchZoom.disable();
			
			this.__map.on("click",function(e){
				if(Map.getLayersMapBase().length >0 || Map.getLayersIndicador().length > 0){
					Map.featureInfo(e, null, Map.getLayersMapBase().length>0 ? false:true, e.latlng.lat, e.latlng.lng);
				}
			});

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
	        	
	        	var aux = "";
	        	for(var i=0; i<capas.capas.length; i++){
	        		aux += capas.capas[i].capa + ",";
	        	}
	        	aux = aux.slice(0,-1);
	        	var layer = L.tileLayer.wms(capas.capas[0].servidor, {
    				layers: aux,
    				format: 'image/png',
    				transparent: true,
    			});
	        	
	        	layer.on("click",function(e){
					alert("")
				});
	        	
	        	layer.addTo(Map.getMap());
	        	
	        	if(esIndicador){
        			Map.getLayersIndicador().push({"id":response.cod_indicador, capa:layer});
        		}else{
        			Map.getLayersMapBase().push({"id":response.cod_indicador, capa:layer});
        		}
	        	
	        	Map.refreshIndex();
	        	
	        	if(response.leyenda != null){
	        		$(".leyenda").html("<img src='/img/leyendas/" + response.leyenda + "'>");
	        	}else{
	        		$(".leyenda").html("");
	        	}
	        	
	        	
	        	response.fechas = response.fechas.sort();
	        	var fechas = "<select class='comboFechas'>";
	        	for(var i=0; i<response.fechas.length; i++){
	        		fechas += ("<option " + (response.fecha == response.fechas[i] ? "selected": '') + ">" + response.fechas[i] + "</option>");
	        	}
	        	fechas += "</select>";
	        	
	        	
	        	//Actualizo el árbol de capas
	        	if(esIndicador){
	        		$(".indicatorName").text(response.name_indicador);
	        		$("#groupLayer").find("h1").find("select").remove()
	        		$(".indicatorName").append("<img class='borrarCapa' title='Eliminar' src='/img/TITA_icon_descartar_capa.svg'>");
	        		$(".indicatorName").append(fechas);
	        		$(".indicatorName").attr("idIndicador", response.cod_indicador);
	        	}else{
	        		$(".mapaBaseList").prepend("<div idIndicador='" + response.cod_indicador + "' class='capa'>" + response.name_indicador + "<img class='borrarCapa' title='Eliminar' src='/img/TITA_icon_descartar_capa.svg'>" +  fechas + "</div>");
	        	}
	        	
	        	groupLayerEvents();
	        },
	    });
    },
    
    featureInfo : function(e,id, esIndicador, lat, lng){
    	
    	var BBOX = this.__map.getBounds().toBBoxString();
		var WIDTH = this.__map.getSize().x;
		var HEIGHT = this.__map.getSize().y;
		var X = this.__map.layerPointToContainerPoint(e.layerPoint).x;
		var Y = this.__map.layerPointToContainerPoint(e.layerPoint).y;
    	
    	
    	
    	if(id == null){
			id = esIndicador? this.__layersIndicador.length-1:this.__layersMapBase.length-1;
		}
    	layers = esIndicador? this.__layersIndicador[id].capa : this.__layersMapBase[id].capa;
    	var layersName = "";
//    	for(var i=0; i<layers.length; i++){
//    		layersName += layers[i].options.layers + ",";
//    	}
//    	
//    	layersName = layersName.slice(0,-1);
    	var request = layers._url + '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=' + layers.options.layers +'&QUERY_LAYERS='+ layers.options.layers +'&STYLES=&BBOX='+BBOX+'&FEATURE_COUNT=5&HEIGHT='+HEIGHT+'&WIDTH='+WIDTH+'&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fhtml&SRS=EPSG%3A4326&X='+X+'&Y='+Y;
    	
    	$.ajax({
			url : "/api/proxy",
			data: { "url": request},	       
			type: "POST",			
	        success: function(data) {
	        	try {
		        	if (!data || data.indexOf("LayerNotQueryable")!=-1){
//		        		obj.featureInfo(e,requestIdx+1);
		        	}
		        	else{
		        		if($.trim($($.parseXML(data)).find("body").html()).length != 0){
		        			idIndicador = $($.parseXML(data)).find("id_indicador").text();
		        			id_geometry = $($.parseXML(data)).find("id_geometria").text();
		        			fecha = $("div[idIndicador='" + idIndicador + "'], h1[idIndicador='" + idIndicador + "']").find("select").val();
		        			
		        			if(idIndicador == "" || id_geometry==""){
		        				if(id>0){
			        				Map.featureInfo(e, id-1, esIndicador, lat, lng);
			        				
			        			}else if(!esIndicador){
			        				Map.featureInfo(e, null, true, lat, lng);
			        			}
		        			}else{
		        				app.router.navigate('info/'+ idIndicador, {trigger: false});
			        			app.showView(new app.view.Indicator({idIndicador:idIndicador, fecha:fecha, id_geometry:id_geometry}));
			        			Map.getMap().setView([lat, lng], 10);
		        			}
		        		}else{
		        			if(id>0){
		        				Map.featureInfo(e, id-1, esIndicador, lat, lng);
		        			}else if(!esIndicador){
		        				Map.featureInfo(e, null, true, lat, lng);
		        			}
		        		}
		        	}
	        	}catch (ex){
	        		if(id>0){
        				Map.featureInfo(e, id-1, esIndicador, lat, lng);
        			}else if(!esIndicador){
        				Map.featureInfo(e, null, true, lat, lng);
        			}
	        	}
	        },
	        error: function(){	        	
	        	obj.featureInfo(e,requestIdx+1);
	        }
	    });
    	
    },
}
