define("./assets/script/app/app1/dist/main-debug", [ "$-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    $(function() {
        $("body").append("<p>jquery is ready!</p>");
    });
    // 对外提供接口
    module.exports = {
        say: function() {
            alert("jquery is ready!");
        }
    };
});