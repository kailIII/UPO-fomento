function changeOpacityAllLayers(opacity){
	var layers = Map.getMap()._layers;
	$.each(layers, function(key){
		if(layers[key].setOpacity != null){
			layers[key].setOpacity(opacity);
		}
	});
}


function changeOpacityById(layers,id,opacity){
	for(var i=0; i<layers.length; i++){
		if(layers[i].id == id){
			layers[i].capa.setOpacity(opacity);
			return layers[i];
		}	
	}
	return null;
}

function restoreMap(){
	Map.getMap().off("click");
	$("#map").css({"cursor":""});
	changeOpacityAllLayers(1);
	$(".featureInfo.active").removeClass("active");
}


$(".botonLeyenda").on('click', function() {
	if ($(".leyenda").is(":visible")) {
		$(".leyenda").fadeOut();
        $(this).text("Mostrar leyenda");
	} else {
		$(".leyenda").fadeIn();
		$(this).text("Ocultar leyenda");
	}
});


$(".moveSpain").on('click', function() {
	Map.getMap().setView([Map.iniLat, Map.iniLng],6)
});

$(".moveCanarias").on('click', function() {
	Map.getMap().setView([27.964499, -15.611037],8)
});


// function drawLines(){
// 	var styleLine = {color: 'green', weight: 5};
//     var styleLine2 = {color: 'red', weight: 5};
//     var initialStyle = {radius: 5,fillColor: "white",color: "green",weight: 1,opacity: 1,fillOpacity: 1};
//     var finalStyle = {radius: 5,fillColor: "green",color: "white",weight: 1,opacity: 1,fillOpacity: 1};
//     intialImage = {iconUrl:"https://cdn1.iconfinder.com/data/icons/musthave/16/Previous.png", iconAnchor:[10,10]};
//     finalImage = {iconUrl:"https://cdn1.iconfinder.com/data/icons/orb/16/7.png", iconAnchor:[10,10]};

//     var line1 = new L.GSFlowLayer("id","title","valor",[37.12090636165327,-5.537109374999999],[37.95286091815649,-3.2135009765625],styleLine, initialStyle, finalStyle, null, null, styleLine2);
//     var line2 = new L.GSFlowLayer("id","title","valor",[36.90090636165327,-5.537109374999999],[36.54936246839778,-3.8287353515624996],styleLine2, initialStyle, finalStyle, intialImage, finalImage, styleLine);
//     var line3 = new L.GSFlowLayer("id","title","valor",[37.12090636165327,-5.537109374999999],[37.95286091815649,-5.2135009765625],styleLine, initialStyle, finalStyle, null, null, styleLine2,9);
//     Map.getMap().addLayer(line1);
//     Map.getMap().addLayer(line2);
//     Map.getMap().addLayer(line3);
// }