/** @name: charcount - v1.0.0 
 *  @description: 字数统计插件 
 *  @author: ChenDeSheng 
 *  @date: 2013-08-30 
 */
/**
 * 字数统计
 * @author: chendesheng
 * @date 2013/08/01
 */
define("eagle/charcount/1.0.0/charcount-debug", [ "gallery/jquery/1.8.0/jquery-debug" ], function(require, exports, module) {
    var $ = require("gallery/jquery/1.8.0/jquery-debug");
    var ua = navigator.userAgent.toLowerCase(), isie = ua.indexOf("msie") > 0, ieversion = isie ? ua.match(/msie ([\d.]+)/)[1] : null, isie6 = isie && ieversion == "6.0";
    // 默认配置属性
    var settings = {
        /**
		 * 用于限制最大允许个数
		 * @type {Number}
		 */
        allowed: 140,
        /**
		 * 用于提示警告统计个数
		 * @type {Number}
		 */
        warning: 25,
        // 用于更改“字数统计”和“内容框”的样式
        css: {
            normal: "counter",
            warning: "warning",
            exceeded: "exceeded"
        },
        // 用于字数统计的元素和提示文本模板
        tips: {
            counterElement: "span",
            //{allowed:限制最大数量}
            //{available:可输入数量}
            //{already:已输入数量}
            //{exceeded:已超过数量}
            normal: "还可以输入{available}字",
            // 正常输入（未超出）显示模板
            exceeded: "已经超过{exceeded}字"
        },
        /**
		 * 用于提示输入文本信息
		 * @type {String}
		 */
        label: "",
        // 内容过滤器
        filter: {
            /**
			 * 是否启用内容过滤
			 * @type {Boolean}
			 */
            enable: true,
            /**
			 * 待过滤标签属性：<img data-text="[开心]" />，<button data-text="回复 张三：" />
			 * @type {String}
			 */
            tagattr: "data-text"
        },
        /**
		 * 用于非汉字1/2个字符计算
		 * @type {Boolean}
		 */
        half: false,
        /**
		 * 去除前后空白字符
		 * @type {Boolean}
		 */
        trim: true,
        /**
		 * 用于截取超出部分字符
		 * @type {Boolean}
		 */
        capture: true,
        /**
		 * 调用模块时，用于判断是否及时显示统计字数
		 * @type {Boolean}
		 */
        initKey: false,
        /**
		 * 用于关闭统计功能
		 * @type {Boolean}
		 */
        closed: false,
        // callbacks 回调函数集合
        callbacks: {
            // 每次计算字数时执行回调函数
            common: function() {},
            // 达到临界点值时执行回调函数
            crisis: function() {}
        }
    };
    // 模块化扩展接口，用于初始化单个统计字数
    var charCount_init = function(content, tipmsg, options) {
        var options = $.extend(true, {}, settings, options || {}), eventcommon = options.callbacks.common, eventcrisis = options.callbacks.crisis, $content = $(content).eq(0), $tipmsg = $(tipmsg).eq(0), contentEditable = $content.is('[contentEditable="true"]');
        /**
		 * 判断内容元素和提示元素是否存在
		 */
        if ($content.length != 1 || $tipmsg.length != 1) {
            return null;
        }
        // 获取内容元素的data-charcount，如果已初始化，则直接返回
        var data_charcount = $content.data("data-charcount"), tagname = ($content[0].tagName || "").toLowerCase(), timeoutid = 0;
        if (typeof data_charcount == "object") {
            return data_charcount;
        }
        // 定义字数统计返回操作对象
        var charCount = {
            options: options,
            // 已经输入{already}字
            getAlready: function() {
                var text = _getval(), count = options.half ? _half(text) : text.length;
                return Math.ceil(count);
            },
            // 还可以输入{available}字
            getAvailable: function(already) {
                already = already || this.getAlready();
                if (options.allowed > already) {
                    return options.allowed - already;
                } else {
                    return 0;
                }
            },
            // 已经超过{exceeded}字
            getExceeded: function(already) {
                already = already || this.getAlready();
                if (already > options.allowed) {
                    return already - options.allowed;
                } else {
                    return 0;
                }
            },
            // 返回编辑器内容
            getval: function() {
                return _getval();
            },
            /**
			 * 设置编辑器内容
			 * @param  {[String]} content [编辑器内容]
			 */
            setval: function(content) {
                _setval(content);
            },
            /**
			 * 移除编辑框label提示信息（此方法已过期，请改用removeLabel）
			 */
            removelabel: function() {
                this.removeLabel();
            },
            /**
			 * 移除编辑框label提示信息
			 */
            removeLabel: function() {
                // event.type = removelabel.cf focus.cf
                // 该事件可设置存在label是自动清空内容
                $content.trigger("removelabel.cf");
            },
            /**
			 * 检查编辑内容是否符合条件（比如：最大限制字符）
			 * @param  {[RegExp]} regExp [可选使用正则验证]
			 * @return {[Bool]}        [返回是否符合条件]
			 */
            checking: function(regExp) {
                var result = this.getAvailable(null) >= 0;
                if (result && regExp instanceof RegExp) {
                    result = regExp.test(this.getval());
                }
                return result;
            },
            // 重新统计字数
            calculate: function() {
                _calculate();
            },
            // 开启字数统计
            open: function() {
                options.closed = false;
                $tipmsg.show();
                this.calculate();
            },
            // 关闭字数统计
            close: function() {
                options.closed = true;
                $tipmsg.hide();
            }
        };
        /**
		 * 获取编辑内容元素的值
		 * @return {[String]}          [编辑内容元素的值]
		 */
        function _getval() {
            var text = null, filter = options.filter;
            if (contentEditable) {
                if (filter.enable) {
                    var $clone = $content.clone(), tagattr = filter.tagattr;
                    // 过滤标签属性
                    $clone.find("*").replaceWith(function() {
                        return typeof tagattr == "string" ? $(this).attr(tagattr) || "" : "";
                    });
                    text = $clone.text();
                    $clone = null;
                } else {
                    text = $content.text();
                }
                text = text.replace(/&nbsp;/g, " ");
            } else {
                text = $content.val();
            }
            // 判断内容是否包含提示输入信息
            if (options.label != "") {
                var pattern = new RegExp("^" + options.label);
                if (pattern.test(text)) {
                    text = text.replace(pattern, "");
                }
            }
            if (options.trim) {
                return $.trim(text);
            }
            return text;
        }
        // 设置编辑内容元素的值
        function _setval(val) {
            if (contentEditable) {
                if (val == "") {
                    $content.html("");
                } else {
                    $content.text(val);
                }
            } else {
                if (isie6 && tagname == "input") {
                    // 在ie6下，input延时赋值
                    clearTimeout(timeoutid);
                    timeoutid = setTimeout(function() {
                        $content.val(val);
                    }, 10);
                } else {
                    $content.val(val);
                }
            }
        }
        // 获取编辑内容，包括HTML标签
        function _getcontent() {
            var content = null;
            if (contentEditable) {
                content = $content.html();
                content = content.replace(/&nbsp;/g, " ");
            } else {
                content = $content.val();
            }
            if (options.trim) {
                return $.trim(content);
            }
            return content;
        }
        /**
		 * [返回非中文单个字符长为 1/2长度]
		 * @param  {[String]} word [单个或多个字符串]
		 * @return {[Number]}      [description]
		 */
        function _half(word) {
            // 判断是否为字符串
            if (typeof word != "string" || word.length == 0) {
                return 0;
            }
            // 判断个数是否大于1个
            if (word.length > 1) {
                var wleng = 0;
                // 内部递归获得字符长度
                for (var i = 0; i < word.length; i++) {
                    wleng += _half(word.charAt(i));
                }
                return wleng;
            }
            var intCode = word.charCodeAt(0);
            if (intCode >= 0 && intCode <= 128) {
                return .5;
            } else {
                return 1;
            }
        }
        // 截取字符串
        function _capture() {
            // 过滤内容
            var filter = options.filter;
            // div、span等元素编辑模式[contentEditable="true"]
            if (contentEditable) {
                var $list = $content.contents(), tagattr = filter.tagattr, // 过滤标签属性
                totallength = 0;
                if (filter.enable) {
                    var html = "";
                    $list.each(function() {
                        // 判断节点为标签 && 标签带有过滤属性
                        if (this.nodeType == 1 && typeof tagattr == "string" && $(this).is("[" + tagattr + '!=""]')) {
                            var data_text = $(this).attr(tagattr);
                            // 半字符计算
                            if (options.half) {
                                for (var i = 0; i < data_text.length; i++) {
                                    totallength += _half(data_text.charAt(i));
                                }
                            } else {
                                totallength += data_text.length;
                            }
                            // 添加标签的data-text文本，如果超出后直接截取
                            if (totallength > options.allowed) {
                                return false;
                            }
                            html += $("<div />").wrapInner($(this).clone()).html();
                        } else if (this.nodeType == 3) {
                            // 遍历节点文本内容，并一一计算判断是否超出范围
                            for (var i = 0; i < this.data.length; i++) {
                                // 半字符计算
                                if (options.half) {
                                    totallength += _half(this.data.charAt(i));
                                } else {
                                    totallength += 1;
                                }
                                // 添加单项文本，如果超出后直接截取
                                if (totallength > options.allowed) {
                                    return false;
                                }
                                html += this.data.charAt(i);
                            }
                        }
                    });
                    $content.html(html);
                } else {
                    var $html = $("<div />");
                    $list.each(function() {
                        // 判断节点为标签
                        if (this.nodeType == 1) {
                            var data_text = $(this).text(), tagName = (this.tagName || "").toLowerCase(), $self = null;
                            if (totallength < options.allowed) {
                                $self = $("<" + tagName + " />");
                                $html.append($self);
                            }
                            for (var i = 0; i < data_text.length; i++) {
                                // 半字符计算
                                if (options.half) {
                                    totallength += _half(data_text.charAt(i));
                                } else {
                                    totallength += 1;
                                }
                                // 添加单项文本，如果超出后直接截取
                                if (totallength > options.allowed) {
                                    return false;
                                }
                                $self.append(data_text.charAt(i));
                            }
                        } else if (this.nodeType == 3) {
                            // 遍历节点文本内容，并一一计算判断是否超出范围
                            for (var i = 0; i < this.data.length; i++) {
                                // 半字符计算
                                if (options.half) {
                                    totallength += _half(this.data.charAt(i));
                                } else {
                                    totallength += 1;
                                }
                                // 添加单项文本，如果超出后直接截取
                                if (totallength > options.allowed) {
                                    return false;
                                }
                                $html.append(this.data.charAt(i));
                            }
                        }
                    });
                    $content.html($html.html());
                }
            } else {
                var val = _getval();
                if (options.half) {
                    var totallength = 0, text = "";
                    for (var i = 0; i < val.length; i++) {
                        totallength += _half(val.charAt(i));
                        if (totallength > options.allowed) {
                            break;
                        }
                        text += val.substr(i, 1);
                    }
                    _setval(text);
                } else {
                    _setval(val.substring(0, options.allowed));
                }
            }
        }
        // 字符串格式化
        function _format(text, arg1, arg2, arg3, more) {
            if (arguments.length == 0) {
                return null;
            }
            // [arg1, arg2, arg3, more]
            var args = Array.prototype.slice.call(arguments, 1);
            return text.replace(/\{(\d+)\}/g, function(m, i) {
                return typeof args[i] == "function" ? args[i]() : args[i];
            });
        }
        // 更新字数统计状态、已输入数量、可输入数量、已超出数量
        function _reftipmsg(status, already, available, exceeded) {
            var html = options.tips[status] ? options.tips[status] : options.tips.normal, countertag = [], counterhtml = "";
            countertag.push("<");
            countertag.push(options.tips.counterElement);
            countertag.push(' class="{0}"');
            countertag.push(">");
            countertag.push("{1}");
            countertag.push("</" + options.tips.counterElement + ">");
            counterhtml = countertag.join("");
            // {already} => <span class="normal warning or normal">already</span>
            html = html.replace(/\{already\}/g, function() {
                return _format(counterhtml, function() {
                    // normal warning or normal
                    return status == "warning" ? options.css.normal + " " + options.css.warning : options.css.normal;
                }, already);
            });
            // {available} => <span class="normal warning or normal">available</span>
            html = html.replace(/\{available\}/g, function() {
                return _format(counterhtml, function() {
                    // normal warning or normal
                    return status == "warning" ? options.css.normal + " " + options.css.warning : options.css.normal;
                }, available);
            });
            // {exceeded} => <span class="normal exceeded or normal">exceeded</span>
            html = html.replace(/\{exceeded\}/g, function() {
                return _format(counterhtml, function() {
                    // normal exceeded or normal
                    return status == "exceeded" ? options.css.normal + " " + options.css.exceeded : options.css.normal;
                }, exceeded);
            });
            // {allowed} => <span class="normal">allowed</span>
            html = html.replace(/\{allowed\}/g, function() {
                // normal
                return _format(counterhtml, options.css.normal, options.allowed);
            });
            $tipmsg.html(html);
        }
        // 处理触发绑定的事件
        function _calculate() {
            if (options.closed) {
                return;
            }
            // 内容过滤器
            var filter = options.filter;
            if (contentEditable && filter.enable && typeof filter.tagattr == "string") {
                // 原使用$content.find() 函数，但是在ie6下面会出现死循环
                $content.children(":not([" + filter.tagattr + "])").replaceWith(function() {
                    return $(this).text();
                });
            }
            var already = 0, // 已经输入{already}字
            available = 0, // 还可以输入{available}字
            exceeded = 0;
            // 已经超过{exceeded}字
            // 统计已输入、可输入、已超过个数
            function statistics() {
                already = charCount.getAlready();
                available = charCount.getAvailable(already);
                exceeded = charCount.getExceeded(already);
            }
            // 开始计算数量
            statistics();
            // 每次计算字数时执行回调函数
            eventcommon.call($content[0]);
            // 已超出个数大于0个
            if (exceeded > 0) {
                // 超出部分截取
                if (options.capture) {
                    _capture();
                    // 超出截取后重新统计
                    statistics();
                    _reftipmsg("warning", already, 0, exceeded);
                } else {
                    _reftipmsg("exceeded", already, available, exceeded);
                }
                // 达到临界值时执行回调函数
                eventcrisis.call($content[0]);
            } else if (available <= options.warning) {
                _reftipmsg("warning", already, available, exceeded);
            } else {
                _reftipmsg("normal", already, available, exceeded);
            }
        }
        // 调用模块时，判断是否及时显示统计字数
        if (options.initKey) {
            _calculate();
        }
        // 设置输入框提示文本信息
        if (options.label != "" && _getcontent() == "") {
            _setval(options.label);
        }
        // 绑定即时监控事件
        // onpropertychange 这个事件是IE专用的，可以监控文本框的值是否改变（过在IE9下这个事件只能监控增加的内容而不能监控删除的内容）
        // oninput 这个事件是专门针对非IE浏览器的，效果和 onpropertychange 是一样的
        // onkeydown这个事件是为了解决onpropertychange 在IE9下存在的那个问题的
        // cut.cc paste.cc
        $content.off(".cc").on("propertychange.cc input.cc keydown.cc keyup.cc change.cc", _calculate);
        // 获取焦点设置label提示信息内容
        $content.off(".cf").on("removelabel.cf focus.cf paste.cf", function() {
            if (options.label != "" && options.label == _getcontent()) {
                _setval("");
            }
        });
        // 失去焦点设置label提示信息内容
        $content.off(".cb").on("blur.cb", function() {
            if (options.label != "" && _getcontent() == "") {
                _setval(options.label);
            }
        });
        // 设置编辑框数据data-charcount
        $content.data("data-charcount", charCount);
        return charCount;
    };
    // 模块化扩展接口，用于初始化多个统计字数
    var charCount_initMulti = function(contents, tipmsgs, options) {
        var $contents = $(contents), $tipmsgs = $(tipmsgs);
        // 判断编辑框和提示框元素个数是否一致
        if ($contents.length == 0 || $contents.length != $tipmsgs.length) {
            return [];
        }
        // 遍历编辑框、提示框初始化字数统计插件
        return $(contents).map(function(i) {
            // 初始化，并返回扩展接口
            return charCount_init($(this), $tipmsgs.eq(i), options);
        }).get();
    };
    // 添加jQuery辅助接口
    $.fn.extend({
        getCharCount: function() {
            return $(this).data("data-charcount") || null;
        }
    });
    // 添加扩展接口
    exports.init = charCount_init;
    exports.initMulti = charCount_initMulti;
});
