var article;

$(document).ready(function() {
    ki.bind('simpleStuff', article);
});

var observable = function() {
    var self = this;
    self.data;
    self.listeners = [];

    function setData(data) {
        var i;
        data = data;
        if (self.listeners) {
            for (i=0; i < self.listeners.length; i++) {
                // execute the callback function
                // to pass a new "this" ist should be listeners[i].call(the new this thingy)
                // an of course, there is no type checking
                console.log('Will call update on ' + self.listeners[i].getName.apply(this, data));
                self.listeners[i].update.apply(this, data);
            }
        }
    }

    function addListener(listener) {
        var i;
        self.listeners.push(listener);
        console.log(self.listeners);
        console.log('Current state of listeners:')
        for (i = 0; i< self.listeners.length; i++) {
            console.log(self.listeners[i].getName());
        }
    }

    function findListenerIndex(listener) {
        var i;
        for (i=0; i < self.listeners.length; i++) {
            if (self.listeners[i] === listener) {
                console.log('Found listener at index ' + i);
                return i;
            }
        }
        console.log('Did not find listener specified');
        return -1
    }

    function removeListener(listener) {
        var index;
        index = findListenerIndex(listener);
        if (index >= 0) {
            self.listeners.splice(index, 1);
        }
    }

    return {
        addListener: function(listener) {
            addListener(listener);
        },
        removeListener: function(listener) {
            removeListener(listener);
        },
        updateData: function(data) {
            setData(data);
        }
    };
};

var SomeListener = function(name) {
    var self = this;
    self.name = name;
    console.log('This is a listener ' + name + ' being constructed');
    return {
        update: function(data) {
            console.log('Update function of ' + self.name + ' was called');
            console.dir(data);
        },
        getName: function() {
            return self.name;
        }
    }
};

$(document).ready(function() {
    var dataListeners = observable();

    var listener1 = new SomeListener('one');
    var listener2 = new SomeListener('two');

    dataListeners.addListener(listener1);
    dataListeners.addListener(listener2);

    if ( console && console.log ) {
        console.log('Will make ajax call');
    }
    jQuery
        .ajax({
            url: './articles.json'
        })
        .done(function(data) {
            if ( console && console.dir) {
                console.dir(data);
            }
            dataListeners.updateData(data);
            dataListeners.removeListener(listener2);
            dataListeners.updateData(data);
        })
        .fail(function() {
            if ( console && console.log) {
                console.log('failed loading data');
            }
        });
});