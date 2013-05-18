;define(function(require, exports, module) {
	var $ = require('jquery');

	$(function(){
		$('body').append('<p>jquery is ready!</p>');
	});

	// 对外提供接口
	module.exports = {
		say: function() {
			alert('jquery is ready!');
		}
	};

});