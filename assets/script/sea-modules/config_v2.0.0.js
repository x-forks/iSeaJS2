/**
 * SeaJS Config
 */

seajs.config({
	plugins: ['shim'],

	alias : {
	    // gallery
		'$': 'gallery/jquery/1.8.0/jquery'
		,'juicer':'gallery/juicer/0.6.4/juicer'
		,'json': 'gallery/json/1.0.3/json'
		,'swfobject': 'gallery/swfobject/2.3.0/swfobject'
		,'SWFUpload': 'gallery/swfupload/2.2.0/swfupload'
		
		// Arale
		,'carousel': 'arale/switchable/0.9.12/carousel'
		,'tabs': 'arale/switchable/0.9.12/tabs'
		,'fixed': 'arale/fixed/1.0.1/fixed'
		,'sticky': 'arale/sticky/1.1.0/sticky'

		// eagle
		// 'charcount': 字数统计
		,'charcount': 'eagle/charcount/1.0.0/charcount'
		// 'imgReady': 图片头数据加载就绪事件 - 更快获取图片尺寸
		,'imgReady': 'eagle/imgReady/1.0.0/imgReady'

		// lib
	    ,'artDialog': {
			src: './assets/script/lib/artDialog/5.0.3/jquery.artDialog.min.js'
			,deps: ['$']
		}
		,'aeImageResize': {
			src: './assets/script/lib/aeImageResize/2.1.3/jquery.ae.image.resize.min.js'
			,deps: ['$']
		}
	}
	,preload: [
		this.jQuery ? '' : '$'
	]
	
});