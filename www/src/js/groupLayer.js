
$(".footerGroupLayer").find("input[type='checkbox']").on( "click", function(){
	var capa = $(this).attr("capa");
	if($(this).is(":checked")){
		if(capa == "relieve"){
			app.layerRelieve.setOpacity(1)
		}else{
			app.base.setOpacity(1)
		}
	}else{
		if(capa == "relieve"){
			app.layerRelieve.setOpacity(0)
		}else{
			app.base.setOpacity(0)
		}
	}
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
				var array = [];
				var capas = $.parseJSON(response.capas);
				for(var i=0; i<layers.length; i++){
					if(layers[i].id == id){
						for(var y=0; y<layers[i].capa.length; y++){
							Map.getMap().removeLayer(layers[i].capa[y]);
						}
						for(var z=0; z<capas.capas.length; z++){
			        		var newLayer = L.tileLayer.wms(capas.capas[z].servidor, {
			    				layers: capas.capas[z].capa,
			    				format: 'image/png',
			    				transparent: true
			    			});	
			        		array.push(newLayer);
			        		newLayer.addTo(Map.getMap());
			        	}
						layers[i].capa=array;
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
}