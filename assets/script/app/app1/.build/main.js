define("./assets/script/app/app1/dist/main", [ "$" ], function(require, exports, module) {
    var $ = require("$");
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