function changeOpacityAllLayers(opacity){
	var layers = Map.getMap()._layers;
	$.each(layers, function(key){
		layers[key].setOpacity(opacity);				
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