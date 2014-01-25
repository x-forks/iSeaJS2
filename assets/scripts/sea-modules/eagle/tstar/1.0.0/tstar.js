define("eagle/tstar/1.0.0/tstar",["jquery/jquery/1.8.3/jquery"],function(t,a,e){var s=t("jquery/jquery/1.8.3/jquery"),i={hoverclass:"star-for",score:0,tagattr:{scorename:"data-star-score"},readonly:!1,onlyonce:!1,complete:function(){},change:function(){},close:function(){},open:function(){},disable:function(){},enable:function(){}};s.fn.tstar=function(t,a){var e=["score","change","close","open","disable","enable","cancelOnce"],i=["score"],c=function(t,a){var e=this["_"+t];return s.isFunction(e)?e.call(this,a||null):null};if(0!=arguments.length&&-1!=s.inArray(t,e))return-1!=s.inArray(t,i)&&s(this).length>0?c.call(s(this)[0],t,a):s(this).each(function(){c.call(this,t,a)});var o=s(this),h=s.isPlainObject(arguments[0])?arguments[0]:null;return n(o,h)};var n=function(t,a){return s(t).each(function(){var t=s.extend({},i,a||{}),e=s(this);if(!s.isNumeric(e.data("data-star"))){var n=e.find("a").length,c=Math.floor(parseInt(e.width())/n),o=[];if(s.isArray(t.hoverclass))o=t.hoverclass;else for(var h=0;n>h;h++)o[h]=t.hoverclass+(h+1);jQuery.extend(this,{_index:0,_hasclick:!1,_childlength:n,_childwidth:c,_hoverclassnames:o,_settings:t,_getHoverElem:function(){return s(this).find("a")},_getShowElem:function(){return s(this).find("span").eq(0)},_getDefaultScore:function(t){var a,e=function(t){return s.isNumeric(t)&&t>=0&&this._childlength>=t};return a=s.isFunction(t)?t.call(this):t,e.call(this,a)?a:(a=s(this).attr(this._settings.tagattr.scorename),e.call(this,a)?a:(a=this._settings.score,e.call(this,a)?a:0))},_getData:function(){return s(this).data("data-star")||0},_setData:function(t){s(this).data("data-star",t)},_callBack:function(t){s.isFunction(this._settings[t])&&this._settings[t].call(this)},_callBackWithScore:function(t,a){s.isFunction(this._settings[t])&&this._settings[t].call(this,a)},_ainmate:function(t){var a=this,e=parseFloat(s.isFunction(t)?t.call(this):t)||0,i=Math.floor(e*this._childwidth),n=s(this),c=this._getShowElem();n.removeClass(this._hoverclassnames[this._index]),this._setData(e),Math.floor(c.width())==i?this._callBackWithScore("change",e):c.animate({width:i},800,function(){a._callBackWithScore.call(a,"change",e)})},_offEvent:function(){this._getHoverElem().hide().off(".tstar"),this._getShowElem().css("margin-left",0)},_onEvent:function(){var t=this;this._getHoverElem().show().off(".tstar").on({"mouseover.tstar":function(){t._getShowElem().css("width",0),t._index=s(this).index(),s(t).addClass(t._hoverclassnames[t._index])},"mouseout.tstar":function(){s(t).removeClass(t._hoverclassnames[t._index]);var a=t._getData();a>0&&t._getShowElem().css("width",function(){return Math.floor(a*t._childwidth)})},"click.tstar":function(){t._hasclick=!0,t._index=s(this).index();var a=t._index+1,e=Math.floor(a*t._childwidth);t._getShowElem().stop(!0),t._setData(a),t._getShowElem().css("width",e),t._settings.onlyonce&&t._offEvent(),t._callBackWithScore.call(t,"complete",a),t._callBackWithScore.call(t,"change",a)}})},_score:function(){return this._getData()},_change:function(t){this._ainmate(t)},_close:function(){var t=this._getData();this._getShowElem().stop(!0),s(this).removeClass(this._hoverclassnames[this._index]),s(this).data("data-star-backup",t),this._offEvent(),this._ainmate(0),this._callBack("close")},_open:function(){var t=s(this).data("data-star-backup");this._settings.readonly||this._settings.onlyonce&&this._hasclick||this._onEvent(),this._ainmate(t),s(this).removeData("data-star-backup"),this._callBack("open")},_disable:function(){var t=s(this).data("data-star-backup");void 0===t&&(this._settings.readonly=!0,this._offEvent(),this._callBack("disable"))},_enable:function(){var t=s(this).data("data-star-backup");void 0===t&&(this._settings.readonly=!1,this._onEvent(),this._callBack("enable"))},_cancelOnce:function(){var t=s(this).data("data-star-backup");void 0===t&&this._settings.onlyonce&&(this._settings.onlyonce=!1,this._onEvent())}}),this._ainmate(this._getDefaultScore),this._settings.readonly?this._offEvent():this._onEvent()}})};e.exports=n});