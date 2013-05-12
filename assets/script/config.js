/**
 * SeaJS Config
 * localhost
 */

seajs.config({
	// Enable plugins
	plugins: ['shim']

	// 当模块标识很长时，可以使用 alias 配置来简化。
	,alias : {
	    // gallery
	    'jquery': {
	    	src: 'gallery/jquery/1.9.1/jquery.js',
            exports: 'jQuery'
	    }
		,'juicer':'gallery/juicer/0.6.4/juicer'
		,'swfobject': 'gallery/swfobject/2.3.0/swfobject-debug'
		

		// lib
	    ,'artDialog': {
			src: 'lib/artDialog/5.0.3/jquery.artDialog.js'
			,deps: ['jquery', 'lib/artDialog/5.0.3/skin/default.css']
			,exports: 'artDialog'
		}
		,'swfobject': {
			src: 'lib/swfobject/2.3.0/swfobject.min.js'
			,exports: 'swfobject'
		}
		/*
		,'SWFUpload': {
			src: 'lib/swfupload/2.2.0/swfupload.min.js'
			,exports: 'SWFUpload'
		}
		*/
	}

	// 开启debug
	,debug: 1
	
});
