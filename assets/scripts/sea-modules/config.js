/**
 * SeaJS Config
 */

seajs.config({
	alias : {
		//seajs
		'seajs-debug': 'seajs/seajs-debug/1.1.1/seajs-debug.js'

		// gallery
		,'cookie': 'gallery/cookie/1.0.2/cookie'
		,'juicer': 'gallery/juicer/0.6.4/juicer'
		,'json': 'gallery/json/1.0.3/json'
		,'swfobject': 'gallery/swfobject/2.2.0/swfobject'
		,'SWFUpload': 'gallery/swfupload/2.2.0/swfupload'
		,'moment': 'gallery/moment/2.0.0/moment'
		,'math': 'gallery/mathjs/0.9.0/math'
		,'DD_belatedPNG': 'gallery/DD_belatedPNG/0.0.8a/DD_belatedPNG'

		// Arale(Alipay)
		,'carousel': 'arale/switchable/1.0.1/carousel'
		,'tabs': 'arale/switchable/1.0.1/tabs'
		,'slide': 'arale/switchable/1.0.1/slide'
		,'sticky': 'arale/sticky/1.3.0/sticky'
		,'widget': 'arale/widget/1.1.1/widget'
		,'validator': 'arale/validator/0.9.7/validator'
		,'placeholder': 'arale/placeholder/1.1.0/placeholder'

		// jquery(jQuery & jQuery.plugin)
		,'$': 'jquery/jquery/1.8.3/jquery'
		,'$-debug': 'jquery/jquery/1.8.3/jquery-debug'
		,'artDialog': 'jquery/artDialog/5.0.2/artDialog'
		,'Highcharts': 'jquery/highcharts/3.0.4/highcharts'
		,'form': 'jquery/form/3.40.0/form'
		,'ztreeCore': 'jquery/ztree/3.5.14/core'
		,'ztreeExcheck': 'jquery/ztree/3.5.14/excheck'
		,'autocomplete': 'jquery/autocomplete/1.1.0/autocomplete'
		,'mousewheel': 'jquery/mousewheel/3.1.3/mousewheel'

		// eagle(JavaScript by us)
		// 字数统计
		,'charcount': 'eagle/charcount/1.0.0/charcount'
		// 'imgReady': 图片头数据加载就绪事件 - 更快获取图片尺寸
		,'imgReady': 'eagle/imgReady/1.0.0/imgReady'
		// 星星评分
		,'tstar': 'eagle/tstar/1.0.0/tstar'
		// 表情插入
		,'smiley': 'eagle/smiley/1.0.0/smiley'
		// 滚动条插件
		,'scrollbar': 'eagle/scrollbar/1.0.0/scrollbar'

	}
	,preload: [
		this.jQuery ? '' : '$'
	]

});