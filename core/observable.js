(function() {
    "use strict";
    var callbacks = [];
    var obj = {
        subscribe: subscribe,
        execute: execute
    }
    window.observable = obj;

    function subscribe(id, fn) {
        callbacks[id] = fn;
    }

    function execute(id) {
        callbacks[id]();
    }
})(window);