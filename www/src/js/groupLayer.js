
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