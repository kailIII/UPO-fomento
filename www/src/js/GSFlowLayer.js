L.GSFlowLayers = L.Class.extend({
		
	initialize: function (options) {

		this.options = options;
		this.layer = L.featureGroup();
		this.centroid =  options.centroids;
		this.styles = options.styles;
		for(var i=0; i<this.centroid.length; i++){
				var data =[
							{
								"lat_origen":this.centroid[i].lat_origen,
								"lng_origen":this.centroid[i].lng_origen,
								"lat_destino":this.centroid[i].lat_destino,
								"lng_destino":this.centroid[i].lng_destino,
								"origin":this.centroid[i].origin,
								"destination":this.centroid[i].destination,
								"value":this.centroid[i].origin_value
							}
				];
				if(this.centroid[i].hasOwnProperty("destination_value")){
					data.push({
								"lat_origen":this.centroid[i].lat_destino,
								"lng_origen":this.centroid[i].lng_destino,
								"lat_destino":this.centroid[i].lat_origen,
								"lng_destino":this.centroid[i].lng_origen,
								"origin":this.centroid[i].destination,
								"destination":this.centroid[i].origin,
								"value":this.centroid[i].destination_value
							});
				}
				this._orderData(data);
				for(var y=0; y<data.length; y++){
					var style = this._searchStyle(data[y].value);
					var initialIcon = new L.CircleMarker([data[y].lat_origen,data[y].lng_origen], {radius: 5,fillColor: "white",color: style.color,weight: 1,opacity: 1,fillOpacity: 1, data:data, value:data[y].value, zoom_min:style.zoom_min, zoom_max:style.zoom_max});
					var finalIcon = new L.CircleMarker([data[y].lat_destino,data[y].lng_destino], {radius: 5,fillColor: style.color,color: "white",weight: 1,opacity: 1,fillOpacity: 1, data:data, value:data[y].value, zoom_min:style.zoom_min, zoom_max:style.zoom_max});
					var line = L.polyline([[data[y].lat_origen,data[y].lng_origen],[data[y].lat_destino,data[y].lng_destino]], {color: style.color, opacity: 1, weight: style.grosor, data:data, value:data[y].value, zoom_min:style.zoom_min, zoom_max:style.zoom_max})
					this.completeLine = L.featureGroup([line, initialIcon,finalIcon]);
					this.layer.addLayer(this.completeLine);
				}
		}

		
	},

	onAdd: function (map) {
        this.map = map;
        var self = this;

        this._draw(map);
        var self = this;
        var style;
        var lastColor;
        this.layer.on('mouseover', function(e) {
        	if(e.layer.options.value){
        		style = self._searchStyle(e.layer.options.value);
        		if(e.layer.options.fillColor){
        			lastColor = e.layer.options.fillColor;
        			e.layer.setStyle({fillColor: style.color_over})
        		}else{
        			e.layer.setStyle({color: style.color_over})
        		}
        	}

		}).on('mouseout', function(e) {
			if(e.layer.options.value){
				// setTimeout(function() {
				    if(e.layer.options.fillColor){
        				e.layer.setStyle({fillColor: lastColor})
	        		}else{
	        			e.layer.setStyle({color: style.color})
	        		}
				  // }, 100);
        	}
		});

		this.layer.on('click', function(e) {
			//Si se trata de un punto tengo que buscar todas las líneas que lo tocan
			var data;
			if(e.layer.hasOwnProperty("_point")){
				data = self._seachDataPoint(e.layer);
			}else{
				data = e.layer.options.data;
			}
			var html = '<div style="max-height:' + ($("#map").outerHeight()/2) + 'px;overflow-x: hidden;overflow-y: auto;">';
			for(var i=0; i<data.length; i++){
				html += '<div class="header">' +
			   				// '<p class="font1">ÁREA METROPOLITANA</p>' +
							'<p class="font2 ellipsis" title="' + data[i].origin + '">' +  data[i].origin + '</p>' +
							'</div>' +
							'<p class="font3">' + self.options.title + ', <span class="font7">' + self.options.fecha + '</span></p>' +
							'<p> <span class="font4">' + (data[i].hasOwnProperty("origin_value") ? data[i].origin_value: data[i].value) + ' </span><span class="font5">' + self.options.uni.toLowerCase() + ' </span><span class="font6 ellipsis" title="' + data[i].destination + '">' + data[i].destination + '</span></p>'
			   				;
			   	if(data[i].hasOwnProperty("destination_value")){
			   		html += '<div class="header">' +
			   				// '<p class="font1">ÁREA METROPOLITANA</p>' +
							'<p class="font2 ellipsis" title="' + data[i].destination + '">' +  data[i].destination + '</p>' +
							'</div>' +
							'<p class="font3">' + self.options.title + ', <span class="font7">' + self.options.fecha + '</span></p>' +
							'<p> <span class="font4">' + data[i].destination_value + ' </span><span class="font5">' + self.options.uni.toLowerCase() + ' </span><span class="font6 ellipsis" title="' + data[i].origin + '">' + data[i].origin + '</span></p>'
			   				;
			   	}
			}
			html += '';
			self.popup = L.popup()
			   .setLatLng(e.latlng) 
			   .setContent(html)
			   .openOn(map);
		});

		map.on('zoomend', function() {
			self._draw(map);
		});
    },

    onRemove: function (map) {
        map.removeLayer(this.layer);
        $.each(this.layer._layers, function(index,layers){
        	$.each(layers._layers, function(index,elem){
        		map.removeLayer(elem);
        	});
        });
	this.layer = L.featureGroup();
    },

    setOpacity:function(zIndex){
    	 $.each(this.layer._layers, function(index,layers){
    	 	layers.setStyle({opacity: zIndex,fillOpacity: zIndex});
        });
    },

    setZIndex:function(zIndex){
    	this.layer.setZIndex(zIndex);
    },

    _reset: function () {
        
    },

    _searchStyle: function(val){
    	for(var i=0; i<this.styles.length; i++){
    		if((parseFloat(this.styles[i].valor_inicial) <= val) && (parseFloat(this.styles[i].valor_final) >= val)){
    			return this.styles[i];	
    		}
    	}
    	return this.styles[this.styles.length - 1]; 
    },

    _orderData: function(data){
    	data = data.sort(function(a, b) {
        	// if (asc) return (a["value"] > b["value"]) ? 1 : ((a["value"] < b["value"]) ? -1 : 0);
        	// else return (b["value"] > a["value"]) ? 1 : ((b["value"] < a["value"]) ? -1 : 0);
        	return (b["value"] > a["value"]) ? 1 : ((b["value"] < a["value"]) ? -1 : 0);
    	});
    },

    _draw:function(map){
    	//Pongo todos los cículos blancos al fondo y limpio las geometrias que no cumplan la condición de zoom
        $.each(this.layer._layers, function(index,layers){
        	$.each(layers._layers, function(index,elem){
        		if(!(Map.getMap().getZoom() >= elem.options.zoom_min && Map.getMap().getZoom() <= elem.options.zoom_max)){
        			map.removeLayer(elem);
        		}else{
        			map.addLayer(elem);
        			if(elem.options.fillColor == "white"){
        				elem.bringToBack();
        			}else if(elem.options.fillColor != null){
        				elem.bringToFront();
        			}
        		}
        	});
		});
    },

    _seachDataPoint:function(layer){

    	var res = [];
    	lat = layer._latlng.lat;
    	lng = layer._latlng.lng;

    	this.centroid.forEach(function(elem) {
		    if((elem.lat_origen == lat && elem.lng_origen == lng) || (elem.lat_destino == lat && elem.lng_destino == lng)){
		    	res = res.concat(elem);
		    }
		});
		return res;
    }
	 
});
