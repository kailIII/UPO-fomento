
$(".footerGroupLayer").find("input[type='checkbox']").on( "click", function(){
	var capa = $(this).attr("capa");
//	if($(this).is(":checked")){
//		if(capa == "relieve"){
//			app.layerRelieve.setOpacity(1)
//		}else{
//			app.base.setOpacity(1)
//		}
//	}else{
//		if(capa == "relieve"){
//			app.layerRelieve.setOpacity(0)
//		}else{
//			app.base.setOpacity(0)
//		}
//	}
	
	Map.getMap().removeLayer(app.baseLayer);
	
	if($(this).is(":checked")){

		app.baseLayer = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
			layers: app.baseRelieve,
			format: 'image/png',
			transparent: true
		});
		
	}else{
		
		app.baseLayer = L.tileLayer.wms("http://tita.geographica.gs/geoserver/fomento_fondo_cartografico/wms?", {
			layers: app.base,
			format: 'image/png',
			transparent: true
		});
	}
	
	app.baseLayer.setZIndex(0);
	app.baseLayer.addTo(Map.getMap());
	
	
});


function groupLayerEvents(){
	$("#groupLayer").find(".capa, h1").unbind().bind( "click", function(){
		app.router.navigate('indicador/'+ $(this).attr("idIndicador"), {trigger: false});
		app.showView(new app.view.Indicator({idIndicador:$(this).attr("idIndicador"), fecha:$(this).find("select").val()}));
	});
	
	
	$("select").unbind().bind( "change", function(){
		var self = $(this);
		var id = $(this).parent().attr("idIndicador");
		var esIndicador = $(this).parent().hasClass("indicatorName")? true:false;
		
//		if($(".indicator").length != 0){
			$(this).parent().trigger("click");
//		}
		
		$.ajax({
			url : "/api/indicador_capas/" + id + "/" + $(this).val(),
			type: "GET",
			success: function(response) {
				var layers = esIndicador ? Map.getLayersIndicador():Map.getLayersMapBase();
				var aux = "";
				var capas = $.parseJSON(response.capas);
				for(var i=0; i<layers.length; i++){
					if(layers[i].id == id){
//						for(var y=0; y<layers[i].capa.length; y++){
//							Map.getMap().removeLayer(layers[i].capa[y]);
//						}
						Map.getMap().removeLayer(layers[i].capa);
						for(var z=0; z<capas.capas.length; z++){
			        		aux += capas.capas[z].capa + ",";
			        	}
						aux = aux.slice(0,-1);
						var newLayer = L.tileLayer.wms(capas.capas[0].servidor, {
		    				layers: aux,
		    				format: 'image/png',
		    				transparent: true
		    			});	
		        		
		        		newLayer.addTo(Map.getMap());
						layers[i].capa=newLayer;
						Map.refreshIndex();
						break;
					}
				}
			}
		});
	});
	
	$("select").on( "click", function(){
		event.stopPropagation();
	});
	
	$(".borrarCapa").unbind().bind( "click", function(){
		var id = $(this).parent().attr("idIndicador");
		var esIndicador = $(this).parent().hasClass("indicatorName")? true:false;
		var layers;
		if(esIndicador){
			layers = Map.getLayersIndicador();
		}else{
			layers = Map.getLayersMapBase();
		}
		for(var i=0; i<layers.length; i++){
			if(layers[i].id == id){
//				for(var y=0; y<layers[i].capa.length; y++){
//					Map.getMap().removeLayer(layers[i].capa[y]);
//				}
				Map.getMap().removeLayer(layers[i].capa);
				layers.splice(i,1)
				if(esIndicador){
					$(this).parent().text("");
					$(this).remove();
				}else{
					$(this).parent().remove();
				}
				break;
			}
		}
		event.stopPropagation();
	});
	
	$(".mapaBaseList").sortable({
		start: function( event, ui ) {
//			$(ui.item).css("background-color","#f2f7fb");
			
		},
		stop: function( event, ui ) {
//			alert($(ui.item).index());
				var old_layer = Map.getLayersMapBase()[Map.getLayersMapBase().length-$(ui.item).index()-1];
				var current_layer;
				for(var i=0; i<Map.getLayersMapBase().length; i++){
					if(Map.getLayersMapBase()[i].id == $(ui.item).attr("idIndicador")){
						current_layer = Map.getLayersMapBase()[i];
						Map.getLayersMapBase()[i] = old_layer;
						break;
					}
				}
				Map.getLayersMapBase()[Map.getLayersMapBase().length-$(ui.item).index()-1] = current_layer;
				Map.refreshIndex();
			}

	});
	
	
	$(".groupLayerVisibility").unbind().bind( "click", function(){
		if($(this).text() == "Ocultar"){
			$(".indicatorName").fadeOut();
			$(".mapaBaseList").fadeOut();
			$("input[type='checkbox']").fadeOut();
			$("label").fadeOut();
			$(this).text("Mostrar");
			$("#groupLayer").css({"min-width":"63px"});
		}else{
			$(".indicatorName").fadeIn();
			$(".mapaBaseList").fadeIn();
			$("input[type='checkbox']").fadeIn();
			$("label").fadeIn();
			$(this).text("Ocultar");
			$("#groupLayer").css({"min-width":""});
		}
	});
}