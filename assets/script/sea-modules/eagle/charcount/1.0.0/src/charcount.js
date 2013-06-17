define(function(require, exports, module) {

	var $ = require('$');

	// 默认配置属性
	var settings = {

		// 用于限制最大允许个数
		allowed: 140,

		// 用于提示警告统计个数
		warning: 25,

		// 用于更改“字数统计”和“内容框”的样式
		css:{
			normal: 'counter',
			warning: 'warning',
			exceeded: 'exceeded'
		},

		// 用于字数统计的元素和提示文本模板
		tips : {
			counterElement: 'span',
			//{allowed:限制最大数量}
			//{available:可输入数量}
		  	//{already:已输入数量}
		  	//{exceeded:已超过数量}
			normal : '还可以输入{available}字',// 正常输入（未超出）显示模板
			exceeded : '已经超过{exceeded}字'// 超出之后显示模板
		},

		// 用于提示输入文本信息
		label: '',

		// 用于非汉字1/2个字符计算
		half: true,

		// 用于截取超出部分字符
		capture : true,

		// 调用模块时，用于判断是否及时显示统计字数
		initKey: false,
		
		// 用于关闭统计功能
		closed: false,

		// callbacks 回调函数集合
		callbacks: {
			// 每次计算字数时执行回调函数
			'common': function(){},
			// 达到临界点值时执行回调函数
			'crisis': function(){}
		}
	};

	// 模块化扩展接口，用于初始化统计字数
	exports.init = function(content, tipmsg, options){
	  	var options = $.extend(true, {}, settings, options || {}),
	  		eventcommon = options.callbacks.common,
	  		eventcrisis = options.callbacks.crisis,
			$content = $(content),
			$tipmsg = $(tipmsg),
			contentEditable = ($content.attr('contentEditable') == 'true');

		if (!$content.length || !$tipmsg.length) {return null;};

		var charCount = {

			options : options,

			// 已经输入{already}字
			getAlready : function(){
				var text = _getval(),
					count = 0;
				
				// 判断内容是否包含提示输入信息
				if ($.trim(options.label) != '') {
					var pattern = new RegExp('^' + options.label);
					if (pattern.test(text)) {
						text = text.replace(pattern, '');
					}
				};

				count = options.half ? text.replace(/[^\x00-\xff]/g,"aa").length / 2 : text.length;
				
				return Math.ceil(count);
			},

			// 还可以输入{available}字
			getAvailable : function(){
				if (options.allowed > this.getAlready()) {
					return options.allowed - this.getAlready();
				}
				else{
					return 0;
				}
			},

			// 已经超过{exceeded}字
			getExceeded : function(){
				if (this.getAlready() > options.allowed) {
					return this.getAlready() - options.allowed;
				}
				else{
					return 0;
				}
			},

			// 重新统计字数
			calculate : function(){
				_calculate();
			},

			// 开启字数统计
			open: function(){
				options.closed = false;
				$tipmsg.show();

				this.calculate();
			},

			// 关闭字数统计
			close: function(){
				options.closed = true;
				$tipmsg.hide();
			}
		};

		// 获取编辑内容元素的值
		function _getval() {
			if (contentEditable) {
				return $content.text();
			}
			else{
				return $content.val();
			}
		}

		// 设置编辑内容元素的值
		function _setval(val) {
			if (contentEditable) {
				return $content.text(val);
			}
			else{
				return $content.val(val);
			}
		}

		// 截取字符串
		function _capture() {

			var str = _getval();

			if (!options.half) {
				_setval(str.substring(0, options.allowed));

				return;
			}

			var totallength = 0,
				text = '';

			for (var i = 0; i< str.length; i++){
			    var intCode = str.charCodeAt(i);
			    if (intCode >= 0 && intCode <= 128) {
			    	totallength = totallength + 0.5; //非中文单个字符长度加 1/2
				}
				else{
			    	totallength = totallength + 1; //中文字符长度则加 1
			    }

			    if (totallength > options.allowed) {
			    	break;
			    }

			    text += str.substr(i,1);
			}

			_setval(text);
    	}

    	// 字符串格式化
    	function _format(text, arg1, arg2, arg3, more) {

	        if (arguments.length == 0)
	        {
	        	return null;
	        }

	        // [arg1, arg2, arg3, more]
	        var args = Array.prototype.slice.call(arguments, 1);
	        
	        return text.replace(/\{(\d+)\}/g, function (m, i) {
	            return typeof(args[i]) == 'function' ? args[i]() : args[i];
	        });
	    };

    	// 更新字数统计状态、已输入数量、可输入数量、已超出数量
		function _reftipmsg(status, already, available, exceeded){
			var html = options.tips[status] ? options.tips[status] : options.tips.normal,
				countertag = [],
				counterhtml = '';

			countertag.push('<');
			countertag.push(options.tips.counterElement);
			countertag.push(' class="{0}"');
			countertag.push('>');
			countertag.push('{1}');
			countertag.push('</'+ options.tips.counterElement +'>');

			counterhtml = countertag.join('');

			// {already} => <span class="normal warning or normal">already</span>
			html = html.replace(/\{already\}/g, function(){

				return _format(counterhtml, function(){

					// normal warning or normal
					return status == 'warning' ? options.css.normal + ' ' + options.css.warning : options.css.normal;
				}, already);
			});

			// {available} => <span class="normal warning or normal">available</span>
			html = html.replace(/\{available\}/g, function(){
				
				return _format(counterhtml, function(){

					// normal warning or normal
					return status == 'warning' ? options.css.normal + ' ' + options.css.warning : options.css.normal;
				}, available);
			});

			// {exceeded} => <span class="normal exceeded or normal">exceeded</span>
			html = html.replace(/\{exceeded\}/g, function(){
				
				return _format(counterhtml, function(){

					// normal exceeded or normal
					return status == 'exceeded' ? options.css.normal + ' ' + options.css.exceeded : options.css.normal;
				}, exceeded);
			});

			// {allowed} => <span class="normal">allowed</span>
			html = html.replace(/\{allowed\}/g, function(){

				// normal
				return _format(counterhtml, options.css.normal, options.allowed);
			});

			$tipmsg.html(html);
		}

		// 处理触发绑定的事件
		function _calculate(){

			if (options.closed) {
				return;
			}

			var already = 0,// 已经输入{already}字
				available = 0,// 还可以输入{available}字
				exceeded = 0;// 已经超过{exceeded}字

			// 统计已输入、可输入、已超过个数
			function statistics(){
				already = charCount.getAlready();
				available = charCount.getAvailable();
				exceeded = charCount.getExceeded();
			}

			// 开始统计
			statistics();

			// 每次计算字数时执行回调函数
			eventcommon.call();

			// 已超出个数大于0个
			if(exceeded > 0){

				// 超出部分截取
				if (options.capture) {
					_capture();

					// 超出截取后重新统计
					statistics();

					_reftipmsg('warning', already, 0, exceeded);
				}
				else{
					_reftipmsg('exceeded', already, available, exceeded);
				}

				// 达到临界值时执行回调函数
				eventcrisis.call();
			}

			// 可输入个数小于警告个数
			else if(available <= options.warning){
				_reftipmsg('warning', already, available, exceeded);
			}

			// 可输入和已输入状态
			else {
				_reftipmsg('normal', already, available, exceeded);
			}
		};
		
		// 调用模块时，判断是否及时显示统计字数
		if (options.initKey) {
			_calculate();
		}

		// 设置输入框提示文本信息
		if ($.trim(options.label) != "" && _getval() == '') {
			_setval(options.label);
		}

		// 绑定即时监控事件
		// onpropertychange 这个事件是IE专用的，可以监控文本框的值是否改变（过在IE9下这个事件只能监控增加的内容而不能监控删除的内容）
		// oninput 这个事件是专门针对非IE浏览器的，效果和 onpropertychange 是一样的
		// onkeydown这个事件是为了解决onpropertychange 在IE9下存在的那个问题的
		$content.off('.cc').on('propertychange.cc input.cc keydown.cc keyup.cc change.cc', _calculate);

		// 获取焦点设置label提示信息内容
		$content.off('.cf').on('focus.cf', function(){
			if ($.trim(options.label) != "" && $.trim(options.label) == $.trim(_getval())) {
				_setval('');
			}
		});

		// 失去焦点设置label提示信息内容
		$content.off('.cb').on('blur.cb', function(){
			if ($.trim(options.label) != "" && _getval() == '') {
				_setval(options.label)
			}
		});

		return charCount;
	};
});