var deps = {}
deps.templateFolder = "js/template";

deps.JS = {
	ThirdParty:{
		src: [
			"js/lib/jquery-2.0.3.min.js",
			"js/lib/underscore-min.js",
			"js/lib/backbone-min.js",
			"js/lib/leaflet/leaflet.js",
			"js/lib/zeroclipboard/ZeroClipboard.js",
			"js/lib/jquery-ui-1.10.4.custom.min.js",
			"js/lib/jquery.fancybox.pack.js",
		],
		desc: "Third party library"
	}
	,Core: {
		src: [
			// Namespace
			"js/namespace.js",
			// Config file
			"js/config.js",

			"js/lib/singleTile.js",
			
			// --------------------
			// ------  Views ------
			// --------------------
			"js/view/error_view.js",
			"js/view/notfound_view.js",
			"js/view/home_view.js",
			"js/global.js",
			"js/map.js",
			"js/groupLayer.js",
			"js/GSFlowLayer.js",
			"js/view/map_view.js",
			"js/view/indicator_view.js",
			"js/view/service_view.js",
			"js/view/project_view.js",
			"js/view/family_view.js",
			
			// --------------------
			// ------  model ------
			// --------------------
			"js/model/family_model.js",
			
			// --------------------
			// ------ collection--
			// --------------------
			
			"js/collection/family_collection.js",
			
			// router
			"js/router.js",
			// app
			"js/app.js",
		],
		desc: "Core library."
	}
};

deps.CSS = {
	ThirdParty:{
		src : [
		      "js/lib/leaflet/leaflet.css",
		      "css/lib/jquery.fancybox.css",
		]
	},
	Core: {
		src: [
			"css/lib/WWW-Styles/reset.css",
			"css/lib/WWW-Styles/base.css",
			"css/styles.css",
			"css/home.css",
		]
	}
};


if (typeof exports !== 'undefined') {
	exports.deps = deps;
}

