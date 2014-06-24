Map = {
	
	layers: [],	
	iniLat: 37.36455,
	iniLng: -4.57645,	
	iniZoom: 8,
	__map:null,
	__layers:[],
	
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
			
			app.layerAndalucia = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fondo_cartografico/wms?", {
				layers: "andalucia_poly",
				format: 'image/png',
				transparent: true
			});
			app.layerAndalucia.addTo(this.__map);
			
			app.layerRelieve = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fondo_cartografico/wms?", {
				layers: "relieve_2",
				format: 'image/png',
				transparent: true
			});
			app.layerRelieve.addTo(this.__map);

			// add zoom control to map left
			var zoomControl = new L.Control.Zoom({
				position : 'topright'
			});		
		
			zoomControl.addTo(this.__map);
		
//			this.__map.touchZoom.disable();

	},

	getMap: function() {
		return this.__map;
	},
	
	getLayers: function() {
		return this.__layers;
	},
	
	removeAllLayers: function() {
		var self = this;
		$.each(this.__layers, function(i){
			self.getMap().removeLayer(self.getLayers()[i]);
		});
		this.__layers = [];
	}
	
}


