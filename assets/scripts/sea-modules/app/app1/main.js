/**
 * test
 * @tony 2013.11.11
 */
;define(function(require, exports, module) {
	var $ = require('$');

	var Log = function log(msg, type) {
		window.console &&
        // Do NOT print `log(msg)` in non-debug mode
        // (type || data.debug) &&
        // Set the default value of type
        console[type || (type = "log")] &&
        // Call native method of console
        console[type](msg);
    };

    // DOM Ready!!!
	$(function(){
		$('#replace').html('<p>jquery is ready!</p>');
	});

	// 对外提供接口
	module.exports = {
		say: function() {
			Log('jquery is ready!');
		}
	};

});
