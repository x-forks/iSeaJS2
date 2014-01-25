/** @name: scrollbar - v1.0.0 
 *  @description: 滚动条插件 
 *  @author: Tony {zhujf620[at]gmail.com} 
 *  @date: 2013-11-11 
 */
define("eagle/scrollbar/1.0.0/scrollbar-debug", [ "jquery/jquery/1.8.3/jquery-debug", "jquery/mousewheel/3.1.3/mousewheel-debug" ], function(require, exports, module) {
    var $ = require("jquery/jquery/1.8.3/jquery-debug"), mousewheel = require("jquery/mousewheel/3.1.3/mousewheel-debug");
    (function($, window, undefined) {
        // DATA_NAME用于该插件下通过$.data()记录参数数据的标识符
        var DATA_NAME = "tscrollbar";
        /**
		 * tScrollbar构造函数
		 * @argument {Object} $obj 主体容器的jQuery对象
		 * @argument {Object} options 参数集合
		 */
        TScrollbar = function($obj, options) {
            // 检查主体容器的jQuery对象是否存在
            if (!$obj.length) {
                return false;
            }
            // 定义插件的通用标识符，以便于区分this
            var PLUGIN = this;
            // 合并'外部传入参数'、'本身保留在$obj.data中的参数'、'默认参数'
            var _opts = options || {};
            var _data = $obj.data(DATA_NAME);
            if (_data) {
                _opts = $.extend({}, _data, _opts);
            }
            var _defalus = $.extend({}, TScrollbar.defaults, _opts);
            // 定义公用jQuery的DOM对象
            PLUGIN.$objs = {
                // 主体容器的外框
                warper: $obj,
                // 往前滚动的按钮
                pre: $obj.find(".scrollbar-pre").eq(0),
                // 往后滚动的按钮
                next: $obj.find(".scrollbar-next").eq(0),
                // 轨道的外框
                track: $obj.find(".scrollbar-bar").eq(0),
                // 轨道的按钮
                trackbtn: $obj.find(".scrollbar-btn").eq(0),
                // 内容的容器
                contain: $obj.find(".scrollbar-main").eq(0),
                // 滚动条的外框
                scrollbarbox: $obj.find(".scrollbar-barbox").eq(0)
            };
            // 验证公用jQuery的DOM对象是否存在
            var _evhave = true;
            $.each(PLUGIN.$objs, function(i, n) {
                if (!n.length) {
                    _evhave = false;
                }
            });
            if (!_evhave) {
                return false;
            }
            /* 记录_defalus设置信息 */
            PLUGIN.$objs["warper"].data(DATA_NAME, _defalus);
            /* 初始化 */
            PLUGIN.init(_defalus);
        };
        TScrollbar.prototype = {
            /**
			 * @desc 重定义TScrollbar.constructor,避免this指向object
			 */
            constructor: TScrollbar,
            /**
			 * @name 初始化
			 */
            init: function(options) {
                var PLUGIN = this, _opts = options;
                // 根据'arrow'确定是否显示'pre'与'next'
                PLUGIN.opts = _opts;
                if (!PLUGIN.opts["arrow"]) {
                    PLUGIN.$objs["pre"].hide();
                    PLUGIN.$objs["next"].hide();
                } else {
                    PLUGIN.$objs["pre"].show();
                    PLUGIN.$objs["next"].show();
                }
                // 根据'mode'确定计算方式
                if (PLUGIN.opts["mode"] === "x") {
                    PLUGIN.cssName = "width";
                    PLUGIN.direct = "left";
                } else if (PLUGIN.opts["mode"] === "y") {
                    PLUGIN.cssName = "height";
                    PLUGIN.direct = "top";
                } else {
                    return false;
                }
                // 重新计算并设置尺寸
                var _eventoff = PLUGIN.setSize();
                if (_eventoff) {
                    if (PLUGIN.opts["arrow"]) {
                        // 绑定Arrow的事件
                        PLUGIN.eventArrow();
                    }
                    // 绑定trackbtn的事件
                    PLUGIN.eventTrack();
                    // 绑定PLUGIN.$objs['warper']的'mousewheel'事件
                    PLUGIN.$objs["warper"].off(".TS").on("mousewheel.TS", function(event, delta) {
                        PLUGIN._eventArrow(delta);
                    });
                }
            },
            /**
			 * @name 重置PLUGIN.$objs['contain']及其它的属性的大小
			 */
            reSize: function() {
                var PLUGIN = this, _opts = PLUGIN.opts;
                if (_opts["arrow"]) {
                    PLUGIN.$objs["pre"].show();
                    PLUGIN.$objs["next"].show();
                    // 绑定Arrow的事件
                    PLUGIN.eventArrow();
                }
                if (_opts["hideauto"]) {
                    PLUGIN.$objs["scrollbarbox"].show();
                }
                PLUGIN.$objs["trackbtn"].show();
                PLUGIN.setContainPosition(0);
                PLUGIN.setTrackbtnPosition(0);
                // 绑定trackbtn的事件
                PLUGIN.eventTrack();
                // 绑定PLUGIN.$objs['warper']的'mousewheel'事件
                PLUGIN.$objs["warper"].off(".TS").on("mousewheel.TS", function(event, delta) {
                    PLUGIN._eventArrow(delta);
                });
                // 重新计算并设置尺寸
                var _eventoff = PLUGIN.setSize();
                if (_eventoff) {
                    // 绑定PLUGIN.$objs['warper']的'mousewheel'事件
                    PLUGIN.$objs["warper"].off(".TS").on("mousewheel.TS", function(event, delta) {
                        PLUGIN._eventArrow(delta);
                    });
                }
            },
            /**
			 * @name 重新计算并设置尺寸
			 */
            setSize: function() {
                var PLUGIN = this, _opts = PLUGIN.opts;
                // 定义公用的size对象，用于记录各块的尺寸
                PLUGIN.size = {
                    warper: parseInt(PLUGIN.$objs["warper"].css(PLUGIN.cssName)),
                    contain: parseInt(PLUGIN.$objs["contain"].css(PLUGIN.cssName)),
                    pre: PLUGIN.opts["arrow"] ? parseInt(PLUGIN.$objs["pre"].css(PLUGIN.cssName)) : 0,
                    next: PLUGIN.opts["arrow"] ? parseInt(PLUGIN.$objs["next"].css(PLUGIN.cssName)) : 0
                };
                // 计算'track'轨道的尺寸
                PLUGIN.size["track"] = PLUGIN.size["warper"] - PLUGIN.size["pre"] - PLUGIN.size["next"];
                // 计算'trackbtn'轨道按钮的尺寸
                PLUGIN.size["trackbtn"] = Math.ceil(PLUGIN.size["track"] * PLUGIN.size["warper"] / PLUGIN.size["contain"]);
                // 赋值'track'轨道的尺寸
                PLUGIN.$objs["track"].css(PLUGIN.cssName, PLUGIN.size["track"]);
                // 如果内容大小小于容器尺寸，则隐藏滚动条
                if (PLUGIN.size["contain"] <= PLUGIN.size["warper"]) {
                    PLUGIN.$objs["pre"].hide();
                    PLUGIN.$objs["next"].hide();
                    PLUGIN.$objs["trackbtn"].css("height", 0).hide();
                    if (_opts["hideauto"]) {
                        PLUGIN.$objs["scrollbarbox"].hide();
                    }
                    $.each(PLUGIN.$objs, function(i, n) {
                        n.off(".TS");
                    });
                    return false;
                }
                // 赋值'trackbtn'轨道的尺寸
                PLUGIN.$objs["trackbtn"].css(PLUGIN.cssName, PLUGIN.size["trackbtn"]);
                // 定义PLUGIN.$objs['contain']的活动范围
                PLUGIN.containScope = PLUGIN.size["warper"] - PLUGIN.size["contain"];
                // 定义PLUGIN.$objs['trackbtn']的活动范围
                PLUGIN.trackbtnScope = PLUGIN.size["track"] - PLUGIN.size["trackbtn"];
                // 定义PLUGIN.$objs['track']的坐标
                var trackCoords = PLUGIN.$objs["track"].offset();
                PLUGIN.trackCoord = trackCoords[PLUGIN.direct];
                return true;
            },
            /**
			 * @name PLUGIN.$objs['contain']滚动到指定位置
			 * @argument {Number} position
			 */
            setContainPosition: function(position) {
                var PLUGIN = this, _position = position ? parseInt(position) : 0;
                if (_position >= 0) {
                    _position = 0;
                } else if (_position <= PLUGIN.containScope) {
                    _position = PLUGIN.containScope;
                }
                PLUGIN.$objs["contain"].css(PLUGIN.direct, _position);
            },
            /**
			 * @name PLUGIN.$objs['trackbtn']滚动到指定位置
			 * @argument {Number} position
			 */
            setTrackbtnPosition: function(position) {
                var PLUGIN = this, _position = position ? parseInt(position) : 0;
                if (_position <= 0) {
                    _position = 0;
                } else if (_position >= PLUGIN.trackbtnScope) {
                    _position = PLUGIN.trackbtnScope;
                }
                PLUGIN.$objs["trackbtn"].css(PLUGIN.direct, _position);
            },
            /**
			 * @name Arrow事件
			 * @base _eventArrow
			 */
            eventArrow: function() {
                var PLUGIN = this, speed = 0, timer = null, timeSet = function(i) {
                    speed += 1;
                    var t = 300 - speed * 25;
                    if (t <= 30) {
                        t = 30;
                    }
                    PLUGIN._eventArrow(i);
                    timer = setTimeout(function() {
                        timeSet(i);
                    }, t);
                };
                function resetTimeset() {
                    if (timeSet) {
                        clearInterval(timeSet);
                        timeSet = null;
                    }
                }
                PLUGIN.$objs["pre"].off(".TS").on({
                    "click.TS": function() {
                        PLUGIN._eventArrow(1);
                    },
                    "mousedown.TS": function() {
                        $(this).addClass("scrollbar-pre-click");
                        timeSet(1);
                    },
                    "mouseup.TS": function() {
                        $(this).removeClass("scrollbar-pre-click");
                        speed = 0;
                        clearTimeout(timer);
                    },
                    "mouseleave.TS": function() {
                        // 靠mouseup清除定时器不靠谱，因为有些情况下可以不执行mouseup
                        $(this).removeClass("scrollbar-pre-click");
                        speed = 0;
                        clearTimeout(timer);
                    }
                });
                PLUGIN.$objs["next"].off(".TS").on({
                    "click.TS": function() {
                        PLUGIN._eventArrow(-1);
                    },
                    "mousedown.TS": function() {
                        $(this).addClass("scrollbar-next-click");
                        timeSet(-1);
                    },
                    "mouseup.TS": function() {
                        $(this).removeClass("scrollbar-next-click");
                        speed = 0;
                        clearTimeout(timer);
                    },
                    "mouseleave.TS": function() {
                        $(this).removeClass("scrollbar-next-click");
                        speed = 0;
                        clearTimeout(timer);
                    }
                });
            },
            /**
			 * @name PLUGIN.$objs['pre'] & PLUGIN.$objs['pre'] 绑定的事件
			 */
            _eventArrow: function(i) {
                var PLUGIN = this, _now = parseInt(PLUGIN.$objs["contain"].css(PLUGIN.direct)), _to = _now + i * 18;
                PLUGIN.setContainPosition(_to);
                var __now = parseInt(PLUGIN.$objs["trackbtn"].css(PLUGIN.direct)), __to = __now + i * Math.floor(18 * PLUGIN.trackbtnScope / PLUGIN.containScope);
                PLUGIN.setTrackbtnPosition(__to);
            },
            /**
			 * @name trackbtn事件
			 */
            eventTrack: function() {
                var PLUGIN = this, doc = $(document);
                PLUGIN.$objs["trackbtn"].off(".TS").on({
                    "click.TS": function(e) {
                        // 阻止事件冒泡
                        e.stopPropagation();
                    },
                    "mousedown.TS": function(e) {
                        PLUGIN.$objs["trackbtn"].addClass("scrollbar-btn-click");
                        var _nowTrackbtn = parseInt(PLUGIN.$objs["trackbtn"].css(PLUGIN.direct)), _nowContain = parseInt(PLUGIN.$objs["contain"].css(PLUGIN.direct)), _coord = PLUGIN.direct === "top" ? e.pageY : e.pageX;
                        doc.off(".TS").on({
                            "mousemove.TS": function(e) {
                                var __coord = PLUGIN.direct === "top" ? e.pageY : e.pageX;
                                __toTrackbtn = _nowTrackbtn + (__coord - _coord), __toContain = _nowContain + Math.floor((__coord - _coord) * PLUGIN.containScope / PLUGIN.trackbtnScope);
                                // 重置'PLUGIN.$objs['trackbtn']'的位置
                                PLUGIN.setTrackbtnPosition(__toTrackbtn);
                                // 重置'PLUGIN.$objs['contain']'的位置
                                PLUGIN.setContainPosition(__toContain);
                            },
                            "mouseup.TS": function() {
                                PLUGIN.$objs["trackbtn"].removeClass("scrollbar-btn-click");
                                doc.off(".TS");
                            }
                        });
                        // 消除默认事件带来的影响
                        return false;
                    }
                });
                // 绑定PLUGIN.$objs['track']的'click'事件
                PLUGIN.$objs["track"].off("click.TS").on("click.TS", function(e) {
                    var _nowTrackbtn = parseInt(PLUGIN.$objs["trackbtn"].css(PLUGIN.direct)), _nowContain = parseInt(PLUGIN.$objs["contain"].css(PLUGIN.direct)), _coord = PLUGIN.direct === "top" ? e.pageY : e.pageX, _toTrackbtn = Math.floor(_coord - PLUGIN.trackCoord - PLUGIN.size["trackbtn"] / 2), _toContain = _nowContain + Math.floor((_toTrackbtn - _nowTrackbtn) * PLUGIN.containScope / PLUGIN.trackbtnScope);
                    // 重置'PLUGIN.$objs['trackbtn']'的位置
                    PLUGIN.setTrackbtnPosition(_toTrackbtn);
                    // 重置'PLUGIN.$objs['contain']'的位置
                    PLUGIN.setContainPosition(_toContain);
                });
            },
            /**
			 * @name PLUGIN.$objs['contain']滚动到指定位置
			 * @argument {Number} position
			 */
            goElement: function(id) {
                var _$elem = $("#" + id);
                if (!_$elem.length) {
                    return false;
                }
                var PLUGIN = this, _positionold = PLUGIN.$objs["contain"].offset()[PLUGIN.direct], _positionnew = _$elem.offset()[PLUGIN.direct];
                var _toContain = _positionold - _positionnew;
                var _toTrackbtn = Math.floor(_toContain * PLUGIN.trackbtnScope / PLUGIN.containScope);
                //alert('_toContain:'+_positionnew+';   _toTrackbtn:'+_toTrackbtn);
                // 重置'PLUGIN.$objs['contain']'的位置
                PLUGIN.setContainPosition(_toContain);
                // 重置'PLUGIN.$objs['trackbtn']'的位置
                PLUGIN.setTrackbtnPosition(_toTrackbtn);
            }
        };
        /**
		 * @name 默认参数
		 */
        TScrollbar.defaults = {
            // 是否开启'箭头滚动'的功能，默认关闭
            arrow: false,
            // 触发'mousedown'事件时'向前箭头'需要的className
            arrowPreClass: "scrollbar-pre-click",
            // 触发'mousedown'事件时'向后箭头'需要的className
            arrowNextClass: "scrollbar-next-click",
            // 触发'mousedown'事件时'滚动条'需要的className
            barBtnClass: "scrollbar-btn-click",
            // '滚动条'显示的模式，横向的值为'x'，竖向的值为'y'，默认为竖向
            mode: "y",
            // '滚动条'显示/隐藏的模式，true表示如果需要滚动条则显示否则隐藏，false则表示一直显示
            hideauto: false
        };
        /**
		 * @name $.fn.tScrollbar jQuery简易调用方式
		 * @desc 适合不需要后期扩展
		 */
        $.fn.tScrollbar = function(options) {
            return $(this).each(function() {
                var _tScrollbar = new TScrollbar($(this), options);
            });
        };
        /**
		 * window.TScrollbar预留一个全局变量储存TScrollbar
		 */
        window.TScrollbar = TScrollbar;
    })(jQuery, window);
    return TScrollbar;
});
