var ki;
ki = (function() {
    Binder = function(node, data) {
        var self = this;
        self.node = node;
        self.data = data;
        return {
            getNode: function() {
                return self.node;
            },
            getData: function() {
                return self.data;
            }
        };
    };

    var nodes = {};

    $(document).ready(function() {
        console.log('Ready action');
    });

    function createKey(id) {
        // TODO HHE implement more appropriate method to retrieve the keys
        return id;
    }

    function _bind(id, data) {
        var bound;
        if (document.getElementById(id)) {
            bound = new Binder(document.getElementById(id), data);
            nodes[createKey(id)] = bound;
        }
    }

    function _update(id, data) {
        var node = nodes[createKey(id)];
    }

    return {
        bind: function(id, data) {
            console.log('Binding data');
            _bind(id, data);
            console.dir(nodes);
        },
        update: function(id, data) {
            console.log('Updating data');
            _bind(id, data);
            console.dir(nodes);
        }
    };
})();