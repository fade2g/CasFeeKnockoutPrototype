/**
 * Created by holger on 10.06.2014.
 */
var ki = ki || {};

ki.handler = (function() {

    return {
        alert: function(context){
            alert("hello world, context=" + context + ", arguments=" + arguments);
            console.dir(context)
            console.dir(window.event);
            console.dir(arguments);
        },
        buildFunction: function(method, arguments) {
            var self = this;
            self.method = method;
            self.arguments = arguments;
            return function(e) {
                alert('Finally, it saved my state, self=' + self.method + ",argument=" + self.arguments + ",e=" + e);
            }
        }
    }
})();