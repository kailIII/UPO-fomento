
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
	restoreMap();
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
		var multiYear = false;
		var fecha;
		if($(this).find("input[type='checkbox']").length > 0){
			multiYear = true;
			fecha = $(this).find("input:checked").map(function() {
			    return $(this).next("label").text();
			}).get().join(",");
		}else{
			fecha = $(this).find("select").val();
		}
		app.router.navigate('indicador/'+ $(this).attr("idIndicador"), {trigger: false});
		app.showView(new app.view.Indicator({idIndicador:$(this).attr("idIndicador"), fecha:fecha, multiYear:multiYear}));
	});
	
	
	$("select").unbind().bind( "change", function(){
		$(this).parent().trigger("click");
		var id = $(this).parent().attr("idIndicador");
		var esIndicador = $(this).parent().hasClass("indicatorName")? true:false;
		Map.drawIndicatorLayer(id, $(this).val(),esIndicador);
	});
	
	$("select").on( "click", function(){
		event.stopPropagation();
	});

	$("div[idIndicador]").find("input[type='checkbox']").unbind().bind( "change", function(){
		var div = $(this).parent().parent();
		var id = div.attr("idIndicador");
		var esIndicador = div.hasClass("indicatorName")? true:false;
		var fechas = div.find("input:checked").map(function() {
			    return $(this).next("label").text();
			}).get().join(",");
		
		if(fechas.length>0){
			Map.drawIndicatorLayer(id,fechas,esIndicador);
		}else{
			$(this).trigger("click");
		}
	});

	
	$(".borrarCapa").unbind().bind( "click", function(){
		var id = $(this).parent().attr("idIndicador");
		var esIndicador = $(this).parent().hasClass("indicatorName")? true:false;
		var layers;
		
		restoreMap();
		
		if(esIndicador){
			layers = Map.getLayersIndicador();
		}else{
			layers = Map.getLayersMapBase();
		}
		for(var i=0; i<layers.length; i++){
			if(layers[i].id == id){
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

	$(".featureInfo").unbind().bind( "click", function(){
		var id = $(this).parent().attr("idIndicador");
		var layer;
		
		if($(this).hasClass("active")){
			restoreMap();
		}else{
			restoreMap();
			$(".featureInfo.active").removeClass("active");
			$(this).addClass("active")
			changeOpacityAllLayers(0.3);
			layer = changeOpacityById(Map.getLayersMapBase(),id,1);
			if(!layer){
				layer = changeOpacityById(Map.getLayersIndicador(),id,1);
			}
			$("#map").css({"cursor":"pointer"});
			Map.getMap().on("click",function(e){
				Map.featureInfo(e,layer, e.latlng.lat, e.latlng.lng)
			});
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
}


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