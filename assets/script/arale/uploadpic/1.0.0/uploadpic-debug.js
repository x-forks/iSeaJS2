define("arale/uploadpic/1.0.0/uploadpic-debug", [ "$-debug", "arale/base/1.0.1/base-debug", "arale/class/1.0.0/class-debug", "arale/events/1.0.0/events-debug", "gallery/swfobject/2.2.0/swfobject-debug", "gallery/jsuri/1.2.2/jsuri-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Base = require("arale/base/1.0.1/base-debug"), swfobject = require("gallery/swfobject/2.2.0/swfobject-debug"), uri = require("gallery/jsuri/1.2.2/jsuri-debug");
    var Uploadpic = Base.extend({
        attrs: {
            version: {
                value: "1.0.2",
                readOnly: true
            },
            url: window.location.href,
            flashUrl: "https://i.alipayobjects.com/e/201303/2Ol8nLL5C9.swf",
            flashVars: {
                cid: "window.upload.uploadpic",
                imgWidth: 1024,
                //图片宽
                imgHeight: 768,
                //图片高
                imgQuality: 75,
                serverURL: "flashUpload.json",
                fliter: "*.jpg;*.bmp;*.jpeg",
                //buttonURL:"https://i.alipayobjects.com/e/201204/2XXhBDRmT3.jpg",
                bgColor: "0x999999",
                textValue: "点击选择要上传的图片",
                param: {}
            },
            success: function(data) {},
            //上传成功回调函数
            errorCallBack: function(errorType) {},
            //errorType 错误类型
            addStageEvent: function() {},
            previwImg: {}
        },
        initialize: function(config) {
            Uploadpic.superclass.initialize.call(this, config);
            this.init();
        },
        init: function() {
            this.showFlash();
        },
        _flashType: function() {
            if (navigator.plugins) {
                for (var i = 0; i < navigator.plugins.length; i++) {
                    if (navigator.plugins[i].name.toLowerCase().indexOf("shockwave flash") >= 0) {
                        return true;
                        break;
                    }
                }
            }
        },
        _showPreview: function(img, bigimg) {},
        showFlash: function() {
            var currentUrlparam = new uri();
            console.log(1);
        }
    });
    module.exports = uploadpic;
});