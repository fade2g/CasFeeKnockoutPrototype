/**
 * Created by holger on 09.06.2014.
 */
/* namespace ki, see book "JavaScrip Patterns, p. 89f */
var ki = ki || {};
ki.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = CASFEE,
        i;
// strip redundant leading global
    if (parts[0] === "CASFEE") {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
// create a property if it doesn't exist
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};