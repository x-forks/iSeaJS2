/**
 * SeaJS Config
 */

seajs.config({
	alias : {
		// gallery
		'cookie': 'gallery/cookie/1.0.2/cookie-debug'
		,'juicer': 'gallery/juicer/0.6.4/juicer'
		,'json': 'gallery/json/1.0.3/json'
		,'swfobject': 'gallery/swfobject/2.3.0/swfobject'
		,'SWFUpload': 'gallery/swfupload/2.2.0/swfupload'
		,'moment': 'gallery/moment/2.0.0/moment'
		,'math': 'gallery/mathjs/0.9.0/math'
		,'DD_belatedPNG': 'gallery/DD_belatedPNG/0.0.8a/DD_belatedPNG'

		// Arale(Alipay)
		,'carousel': 'arale/switchable/0.9.12/carousel'
		,'tabs': 'arale/switchable/0.9.12/tabs'
		,'sticky': 'arale/sticky/1.1.0/sticky'
		,'widget': 'arale/widget/1.1.1/widget'
		,'validator': 'arale/validator/0.9.6/validator'
		,'placeholder': 'arale/placeholder/1.1.0/placeholder'

		// jquery(jQuery & jQuery.plugin)
	    ,'$': 'jquery/jquery/1.8.3/jquery'
		,'artDialog': 'jquery/artDialog/5.0.2/artDialog'
		,'Highcharts': 'jquery/highcharts/3.0.4/highcharts'
		,'form': 'jquery/form/3.40.0/form'
		,'ztreeCore': 'jquery/ztree/3.5.14/core'
		,'ztreeExcheck': 'jquery/ztree/3.5.14/excheck'
		,'autocomplete': 'jquery/autocomplete/1.1.0/autocomplete'

		// eagle(JavaScript by us)
	    // 字数统计
		,'charcount': 'eagle/charcount/1.0.0/charcount'
		// 'imgReady': 图片头数据加载就绪事件 - 更快获取图片尺寸
		,'imgReady': 'eagle/imgReady/1.0.0/imgReady'

	}
	,preload: [
		this.jQuery ? '' : '$'
	]

});