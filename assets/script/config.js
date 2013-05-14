/**
 * SeaJS Config
 */

seajs.config({
	plugins: ['shim'],

	alias : {
	    // gallery
	    'jquery': {
	    	src: 'gallery/jquery/1.8.0/jquery',
            exports: 'jQuery'
	    }
		,'juicer':'gallery/juicer/0.6.4/juicer'
		,'swfobject': 'gallery/swfobject/2.3.0/swfobject-debug'
		

		// lib
	    ,'artDialog': {
			src: 'lib/artDialog/5.0.3/jquery.artDialog.js'
			,deps: ['jquery']
		}
		,'SWFUpload': {
			src: 'lib/swfupload/2.2.0/swfupload.min.js'
			,exports: 'SWFUpload'
		}
	},
	debug: 1
	
});


/*
 * 1、jquery ---> OK
 * 2、juicer ---> OK
 * 3、artDialog ---> OK
 * 4、SWFUpload ---> OK
 * 5、swfobject ---> OK
 */