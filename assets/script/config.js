/**
 * SeaJS Config
 */

seajs.config({
	plugins: ['shim'],

	alias : {
		// Arale
		'carousel': 'arale/switchable/0.9.12/carousel'
		,'tabs': 'arale/switchable/0.9.12/tabs'
		,'fixed': 'arale/fixed/1.0.1/fixed'
		,'sticky': 'arale/sticky/1.1.0/sticky'

	    // gallery
		,'$': 'gallery/jquery/1.8.0/jquery'
		,'juicer':'gallery/juicer/0.6.4/juicer'
		,'json': 'gallery/json/1.0.3/json'
		,'swfobject': 'gallery/swfobject/2.3.0/swfobject'
		

		// lib
	    ,'artDialog': {
			src: './assets/script/lib/artDialog/5.0.3/jquery.artDialog.min.js'
			,deps: ['$']
		}
		,'SWFUpload': {
			src: './assets/script/lib/swfupload/2.2.0/swfupload.min.js'
			,exports: 'SWFUpload'
		}
	}
	,preload: [
		this.jQuery ? '' : '$'
	]
	
});


/*
 * 1、jquery ---> OK
 * 2、juicer ---> OK
 * 3、artDialog ---> OK
 * 4、SWFUpload ---> OK
 * 5、swfobject ---> OK
 */