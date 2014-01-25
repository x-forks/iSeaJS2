/** @name: tstar - v1.0.0 
 *  @description: 星星评分 
 *  @author: ChenDeSheng 
 *  @date: 2013-11-11 
 */
/**
 * 星星评分
 * @author: chendesheng
 * @date 2013/08/01
 */
define("eagle/tstar/1.0.0/tstar-debug", [ "jquery/jquery/1.8.3/jquery-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.8.3/jquery-debug");
    /**
	 * 评星默认配置选项
	 * @type {Object}
	 */
    var defaults = {
        /**
		 * ①星星点亮后的className的前缀，后跟[1, 2, .., Length]
		 * @type {String}
		 * OR
		 * ②星星点亮后的className的字符串的集合
		 * @type {Arrya}
		 */
        hoverclass: "star-for",
        /**
		 * 默认评分数值
		 * @type {Number}
		 */
        score: 0,
        /**
		 * 标签属性
		 * @type {Object}
		 */
        tagattr: {
            /**
			 * 指定标签属性的评分数值
			 * @type {String}
			 * 
			 * 注意：优先值大于默认评分数值（[defaults.tagattr.scorename] > [defaults.score]）
			 */
            scorename: "data-star-score"
        },
        /**
		 * 只读模式
		 * @type {Boolean}
		 */
        readonly: false,
        /**
		 * 仅只能点评一次
		 * @type {Boolean}
		 */
        onlyonce: false,
        /**
		 * 点评的回调函数（仅点击星星后触发的回调函数）
		 * @return {[void]}
		 */
        complete: function() {},
        /**
		 * ①完成初始化评星值的回调函数（读取[defaults.tagattr.scorename] OR [defaults.score]更改后触发）
		 * ②完成点评的回调函数（同complete回调函数，在此之后触发）
		 * ③完成手动更改点评值的回调函数（由api方法change更改后触发）
		 * @return {[void]}
		 */
        change: function() {},
        /**
		 * 设置关闭的回调函数
		 * @return {[void]}
		 */
        close: function() {},
        /**
		 * 还原关闭之前状态的回调函数
		 * @return {[void]}
		 */
        open: function() {},
        /**
		 *  设置只读模式的回调函数
		 * @return {[void]}
		 */
        disable: function() {},
        /**
		 * 设置非只读模式的回调函数
		 * @return {[void]}
		 */
        enable: function() {}
    };
    /**
	 * 定义jQuery扩展接口
	 * 注意：$.fn.tstar = function(options) => 详细请查看函数：Tstar(定义SeaJS扩展接口)
	 * @param  {[String]} apiname [API接口名]
	 * @param  {[Number]} data    [数值（仅用于api接口名为change时）]
	 * @return {[jQuery]}         [返回jQuery自身对象]
	 */
    $.fn.tstar = function(apiname, data) {
        var publicapis = [ "score", "change", "close", "open", "disable", "enable", "cancelOnce" ], // 公共api接口函数名
        singleapis = [ "score" ], // 单点api接口函数名，表示$(this).first()对象会调用指定api函数
        exemethod = function(apiname, data) {
            // 从elem中读取已绑定的函数
            var _method = this["_" + apiname];
            // 判断此函数是否有效
            if ($.isFunction(_method)) {
                // 调用该函数，并且传入数值
                return _method.call(this, data || null);
            }
            return null;
        };
        // 判断当前调用的api函数名是否属于公共api接口
        if (arguments.length != 0 && $.inArray(apiname, publicapis) != -1) {
            // 判断当前调用的api函数名是否属于单点api接口
            if ($.inArray(apiname, singleapis) != -1 && $(this).length > 0) {
                return exemethod.call($(this)[0], apiname, data);
            }
            // 遍历元素调用接口函数
            return $(this).each(function() {
                exemethod.call(this, apiname, data);
            });
        } else {
            var element = $(this), options = $.isPlainObject(arguments[0]) ? arguments[0] : null;
            return Tstar(element, options);
        }
    };
    /**
	 * 定义SeaJS扩展接口
	 * @param  {[String、Dom、jQuery]} element [jQuery选择器、DOM对象、jQuery对象]
	 * @param  {[Object]}              options [自定义配置属性]
	 * @return {[jQuery]}                      [返回jQuery自身对象]
	 */
    var Tstar = function(element, options) {
        return $(element).each(function() {
            // 深度拷贝自定义配置选项
            var settings = $.extend({}, defaults, options || {});
            var self = this, $self = $(this);
            /**
			 * 判断评星对象是否已初始化
			 */
            if ($.isNumeric($self.data("data-star"))) {
                return;
            }
            var childlength = $self.find("a").length, // 星星个数
            childwidth = Math.floor(parseInt($self.width()) / childlength), // 星星宽度
            hoverclassnames = [];
            // 星星hover样式类名数组
            /**
			 * 判断自定义的settings.hoverclass是否为数组
			 */
            if ($.isArray(settings["hoverclass"])) {
                hoverclassnames = settings["hoverclass"];
            } else {
                /**
				 * 根据星星个数自动生成hover样式类名数组
				 */
                for (var i = 0; i < childlength; i++) {
                    hoverclassnames[i] = settings["hoverclass"] + (i + 1);
                }
            }
            /**
			 * this 扩展对象
			 */
            jQuery.extend(this, {
                /*******************************PRIVATE-VARIABLE-START**************************************/
                _index: 0,
                // 当前目标在星星集合中的索引值
                _hasclick: false,
                // 是否
                _childlength: childlength,
                // 星星个数
                _childwidth: childwidth,
                // 星星宽度(px)
                _hoverclassnames: hoverclassnames,
                // 星星hover样式类名数组
                _settings: settings,
                // 自定义配置选项
                /*******************************PRIVATE-VARIABLE-END**************************************/
                /*******************************PRIVATE-METHOD-START**************************************/
                /**
				 * 获取星星的jQuery集合
				 * @return {[jQuery]} [当前对象下的所有A元素]
				 */
                _getHoverElem: function() {
                    return $(this).find("a");
                },
                /**
				 * 获取显示的jQuery集合
				 * @return {[jQuery]}   [当前对象下的第一个SPAN对象]
				 */
                _getShowElem: function() {
                    return $(this).find("span").eq(0);
                },
                /**
				 * 返回默认评分数值
				 * @param  {[Number]}   score [可null，一个评分数值]
				 * OR
				 * @param  {[Function]} score [可null，一个可获取评分数的函数]
				 * 
				 * @return {[Number]}         [优先顺序：score(@param) > settings.tagattr.scorename > settings.score]
				 */
                _getDefaultScore: function(score) {
                    var _score, /**
						 * 判断是否符合的点评分值
						 * @param  {[Number]}  score [点评分值]
						 * @return {[Boolean]}       [符合条件返回True]
						 */
                    _checkscore = function(score) {
                        return $.isNumeric(score) && score >= 0 && score <= this._childlength;
                    };
                    /**
					 * 如果一个评分数值是一个函数，则会读取返回值作为评分值
					 * @type {[Number]}
					 */
                    _score = $.isFunction(score) ? score.call(this) : score;
                    /**
					 * 判断是否符合的点评分值
					 */
                    if (_checkscore.call(this, _score)) {
                        return _score;
                    }
                    /**
					 * 读取settings.tagattr.scorename自定义属性值作为评分值
					 * @type {[Number]}
					 */
                    _score = $(this).attr(this._settings["tagattr"]["scorename"]);
                    /**
					 * 判断是否符合的点评分值
					 */
                    if (_checkscore.call(this, _score)) {
                        return _score;
                    }
                    /**
					 * 读取settings.score自定义属性值作为评分值
					 * @type {[type]}
					 */
                    _score = this._settings["score"];
                    /**
					 * 判断是否符合的点评分值
					 */
                    if (_checkscore.call(this, _score)) {
                        return _score;
                    }
                    return 0;
                },
                /**
				 * 返回存储在jQuery.Data且Key为data-star的值
				 * @return {[Number]} [如果key：'data-star'存在返回对应的值 或 0]
				 */
                _getData: function() {
                    return $(this).data("data-star") || 0;
                },
                /**
				 * 设置存储在jQuery.Data且Key为data-star的值
				 * @param {[Number]} score [一个评分值]
				 */
                _setData: function(score) {
                    $(this).data("data-star", score);
                },
                /**
				 * 执行一个回调函数
				 * @param  {[String]} method [一个回调函数名]
				 * @return {[void]}
				 */
                _callBack: function(method) {
                    $.isFunction(this._settings[method]) && this._settings[method].call(this);
                },
                /**
				 * 执行一个名为带评分值的回调函数
				 * @param  {[String]} method [一个回调函数名]
				 * @param  {[Number]} score [用于传给回调函数的一个评分值]
				 * @return {[void]}
				 */
                _callBackWithScore: function(method, score) {
                    $.isFunction(this._settings[method]) && this._settings[method].call(this, score);
                },
                /**
				 * 设置星星点评值的显示动画函数
				 * @param  {[Number]}   score [一个评分数值]
				 * OR
				 * @param  {[Function]} score [一个可获取评分数的函数]
				 * 
				 * @return {[void]}
				 */
                _ainmate: function(score) {
                    var _self = this, /**
						 * 一个评分数值 或 一个可获取评分数的函数的返回值作为评分值
						 * @type {[Number]}
						 */
                    _score = parseFloat($.isFunction(score) ? score.call(this) : score) || 0, /**
						 * 星星显示的宽度
						 * @type {[Number]}
						 */
                    _width = Math.floor(_score * this._childwidth), $self = $(this), $showElem = this._getShowElem();
                    // 还原hoverclass默认状态
                    $self.removeClass(this._hoverclassnames[this._index]);
                    // 设置存储在jQuery.Data且Key为data-star的值
                    this._setData(_score);
                    // 如果显示的宽度与预更改的宽度相同，则不执行动画
                    if (Math.floor($showElem.width()) == _width) {
                        this._callBackWithScore("change", _score);
                    } else {
                        // 根据预更改的宽度，执行动画
                        $showElem.animate({
                            width: _width
                        }, 800, function() {
                            _self._callBackWithScore.call(_self, "change", _score);
                        });
                    }
                },
                /*******************************PRIVATE-METHOD-END**************************************/
                /*******************************PRIVATE-EVENT-START**************************************/
                /**
				 * 移除命名空间为.tstar的所有绑定的事件
				 * @return {[void]}
				 */
                _offEvent: function() {
                    this._getHoverElem().hide().off(".tstar");
                    this._getShowElem().css("margin-left", 0);
                },
                /**
				 * 绑定每个星星的mouseover.tstar、mouseout.tstar、click.tstar事件
				 * @return {[void]}
				 */
                _onEvent: function() {
                    var self = this;
                    //self => span class="star-wrap"
                    this._getHoverElem().show().off(".tstar").on({
                        "mouseover.tstar": function() {
                            self._getShowElem().css("width", 0);
                            self._index = $(this).index();
                            // this => current a
                            // 添加当前hoverclass样式类
                            $(self).addClass(self._hoverclassnames[self._index]);
                        },
                        "mouseout.tstar": function() {
                            // 还原hoverclass默认状态
                            $(self).removeClass(self._hoverclassnames[self._index]);
                            var _data = self._getData();
                            // 如果已缓存值，则还原到默认的点评值
                            if (_data > 0) {
                                self._getShowElem().css("width", function() {
                                    return Math.floor(_data * self._childwidth);
                                });
                            }
                        },
                        "click.tstar": function() {
                            // 表示触发点击
                            self._hasclick = true;
                            self._index = $(this).index();
                            // this => current a
                            // 获取索引，并计算显示的宽度
                            var _data = self._index + 1, _width = Math.floor(_data * self._childwidth);
                            // 触发点击事件后，停止所有动画执行
                            self._getShowElem().stop(true);
                            self._setData(_data);
                            self._getShowElem().css("width", _width);
                            // 如果自定义配置选项只允许点评一次，则需要移除相关绑定的事件
                            if (self._settings["onlyonce"]) {
                                self._offEvent();
                            }
                            // 执行complete和change回调函数
                            self._callBackWithScore.call(self, "complete", _data);
                            self._callBackWithScore.call(self, "change", _data);
                        }
                    });
                },
                /*******************************PRIVATE-EVENT-END**************************************/
                /*******************************API-START**************************************/
                /**
				 * 返回jQuery集合中第一个元素的点评分值 [API接口名为score]
				 * @return {[Number]} [返回已点评的分值，如果未点评则返回0]
				 */
                _score: function() {
                    return this._getData();
                },
                /**
				 * 更改点评分值 [API接口名为change]
				 * @param  {[Number]} val [一个评分值]
				 * @return {[void]}
				 */
                _change: function(val) {
                    this._ainmate(val);
                },
                /**
				 * 关闭星星点评功能 [API接口名为close]
				 * @return {[void]}
				 */
                _close: function() {
                    var _data = this._getData();
                    // 调用关闭接口后，停止所有动画执行
                    this._getShowElem().stop(true);
                    // 还原hoverclass默认状态
                    $(this).removeClass(this._hoverclassnames[this._index]);
                    // 添加关闭之前的评分值，用于还原时用到的评分值
                    $(this).data("data-star-backup", _data);
                    // 移除相应的绑定事件，设置显示宽度为0，并且执行关闭后的回调函数
                    this._offEvent();
                    this._ainmate(0);
                    this._callBack("close");
                },
                /**
				 * 还原关闭之前状态 [API接口名为open]
				 * @return {[void]}
				 */
                _open: function() {
                    // 获取关闭之前的评分值
                    var _data = $(this).data("data-star-backup");
                    // 判断不是只读 并且 不是仅只能一次点评情况下已点评过 时重新绑定事件
                    if (!this._settings["readonly"] && !(this._settings["onlyonce"] && this._hasclick)) {
                        this._onEvent();
                    }
                    // 还原显示宽度，移除关闭之前的data 并且执行还原关闭之前状态的回调函数
                    this._ainmate(_data);
                    $(this).removeData("data-star-backup");
                    this._callBack("open");
                },
                /**
				 * 设置只读模式 [API接口名为disable]
				 * @return {[void]}
				 */
                _disable: function() {
                    // 获取关闭之前的评分值，如果未还原关闭之前的状态，则不能设置只读模式
                    var _data = $(this).data("data-star-backup");
                    if (typeof _data != "undefined") {
                        return;
                    }
                    // 设置自定义配置选项为只读模式，移除相应的绑定事件 并且执行设置只读模式的回调函数
                    this._settings["readonly"] = true;
                    this._offEvent();
                    this._callBack("disable");
                },
                /**
				 * 设置非只读模式  [API接口名为enable]
				 * @return {[void]}
				 */
                _enable: function() {
                    // 获取关闭之前的评分值，如果未还原关闭之前的状态，则不能设置非只读模式
                    var _data = $(this).data("data-star-backup");
                    if (typeof _data != "undefined") {
                        return;
                    }
                    // 设置自定义配置选项为非只读模式，添加相应的绑定事件 并且执行设置非只读模式的回调函数
                    this._settings["readonly"] = false;
                    this._onEvent();
                    this._callBack("enable");
                },
                /**
				 * 取消仅只能点评一次模式  [API接口名为cancelOnce]
				 * @return {[void]}
				 */
                _cancelOnce: function() {
                    // 获取关闭之前的评分值，如果未还原关闭之前的状态，则不能设置取消仅只能点评一次模式
                    var _data = $(this).data("data-star-backup");
                    if (typeof _data != "undefined") {
                        return;
                    }
                    // 设置自定义配置选项为取消仅只能点评一次模式，添加相应的绑定事件
                    if (!this._settings["onlyonce"]) {
                        return;
                    }
                    this._settings["onlyonce"] = false;
                    this._onEvent();
                }
            });
            // get > set > ainmate
            // 获取显示宽度，使用动画设置显示宽度
            this._ainmate(this._getDefaultScore);
            // 如果自定义配置选项设置仅只读，则不需要给元素绑定事件
            if (this._settings["readonly"]) {
                this._offEvent();
            } else {
                // 初始化绑定mouseover.tstar、mouseout.tstar、click.tstar事件
                this._onEvent();
            }
        });
    };
    /**
	 * 重新设置模块扩展
	 * @type {[Function]}
	 */
    module.exports = Tstar;
});
