Map = {
	
	layers: [],	
	iniLat: 37.36455,
	iniLng: -4.57645,	
	iniZoom: 8,
	__map:null,
	
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
			


			// add zoom control to map left
			var zoomControl = new L.Control.Zoom({
				position : 'topright'
			});		
		
			zoomControl.addTo(this.__map);
		
			this.__map.touchZoom.disable();

	},

	getMap: function() {
		return this.__map;
	},
	
}

