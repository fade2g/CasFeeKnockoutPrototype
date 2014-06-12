/**
 * Created by holger on 09.06.2014.
 */
var ki = ki || {};

$(document).ready(function() {
    var tmpl;
    tmpl = ki.init();
    console.log(tmpl.getTemplates());
    console.log(tmpl.getTemplatedNodes());
    tmpl.applyTemplates();
});

ki.init = function() {
    var self = this;
    self.templates = {};
    self.templatedNodes = [];
    self.models = {};

    /**
     * This constructor builds a new templated node
     * @node {Node} a node element that has a template assigned to it
     * @constructor
     */
    function TemplatedNode(node) {
        var self = this;
        self.node = node;
        self.templateName = node.getAttribute('data-ki-template').valueOf() || 'missing';
        self.loopVar = node.getAttribute('data-ki-foreach') ? node.getAttribute('data-ki-foreach').valueOf() : undefined;

        function matchLoopVar(context) {
            var keys = self.loopVar.split('.'),
                v = context[keys.shift()];
            for (var i = 0, l = keys.length; i < l; i++) {
                v = v[keys[i]];
            }
            return (typeof v !== 'undefined' && v !== null) ? v : "";
        }

        return {
            /**
             * This method returns the DOM Node inside which the template shall be applies
             * @returns {Element}
             */
            getNode: function() {
                return self.node;
            },
            /**
             * This method returns the name of the template to be applied on the node
             * @returns {string|string|*}
             */
            getTemplateName: function() {
                return self.templateName;
            },
            /**
             * This method returns true, if the template shall be repeated
             * @returns {boolean}
             */
            hasLoop: function() {
                return self.loopVar !== undefined;
            },
            /**
             * This method returns the name of the loop variable (not the loop variable itself)
             * @returns {string|*}
             */
            loopVar: function() {
                return self.loopVar;
            },
            /**
             * This function returns the loop variable on the given context
             * @param context
             * @returns {*}
             */
            matchLoopVar: function(context) {
                return matchLoopVar(context)
            }
        }
    }

    /**
     * This function parses the document and searches for all templates contained in the document
     */
    function parseDocument() {
        var scripts,
            script,
            attribute,
            i;
        scripts = document.getElementsByTagName('script');
        i = scripts.length;
        while (i > 0) {
            script = scripts[i];
            if (script != undefined) {
                attribute = script.getAttribute('type');
                if (attribute && attribute.valueOf() === 'kickin/template') {
                    // finally, if found the script tag for a template,
                    // now strap it from the script tag and store it in the
                    console.log('Logging template...');
                    console.dir(script);
                    // templates are properties of the template object
                    self.templates[script.id] = script.innerHTML;
                }
            }
            i--;
        }
    }

    /**
     * This function parses the document for a given property and a given name
     * @param {String} attributeName
     * @param {String} attributeValue
     * @return {Array} array with the elements matched
     */
    function parseDocumentForProperties(attributeName, attributeValue) {
        var nodes,
            node,
            i,
            found,
            defaultMatcher;

        /* Use the default matcher when generalizing the function to inject sort of a strategy
        defaultMatcher = function(node) {
            return node && node.getAttribute(attributeName) && node.getAttribute(attributeName).valueOf() === attributeValue
        };
        */

        nodes = document.getElementsByTagName('*');
        found = [];
        i = nodes.length;
        while (i > 0) {
            node = nodes[i];
            if (node && node.getAttribute(attributeName) && node.getAttribute(attributeName).valueOf() === attributeValue) {
                // found a node with the given attribute name and attribute value
                // put the node into the array
                found.push(node);
            }
            i--;
        }
        return found;
    }

    /**
     * This function applies the bindings inside of a template string.
     * Inspired from https://github.com/trix/nano
     * @param context {Object} The context provides the actual data
     * @param template {Object} The template, on which the bindings shall be applied
     */
    function applyBindings(context, template) {
        return template.replace(/\{{([\w\.]*)\}}/g,
            function(str, key) {
                var keys = key.split('.'),
                    v = context[keys.shift()];
                for (var i = 0, l = keys.length; i < l; i++) {
                    v = v[keys[i]];
                }
                return (typeof v !== 'undefined' && v !== null) ? v : "";
            }
        );
    }

    /**
     * Walk the dom function taken from
     * http://www.javascriptcookbook.com/article/Traversing-DOM-subtrees-with-a-recursive-walk-the-DOM-function
     * @param node {node} An HTML node
     * @param func {function} a function to be called
     * @param context {object} an object with the scoped variable
     */
    function walkTheDOM(node, func, context) {
        func(node, context);
        node = node.firstChild;
        while (node) {
            walkTheDOM(node, func, context);
            node = node.nextSibling;
        }
    }

    /**
     * This function attaches the handlers defined in the node via data-ki-handler
     * @param node
     * @param context
     */
    function applyHandlers(node, context) {
        var handlerDescription,
            handlerParts,
            eventName,
            eventFunction,
            self;
        self = this;
        self.context = context;
        if(node && node.nodeType === 1 && node.getAttribute('data-ki-handler')) {
            handlerDescription = node.getAttribute('data-ki-handler');
            if (handlerDescription) {
                handlerParts = handlerDescription.split(':');
                eventName = handlerParts[0];
                eventFunction = ki.handler.buildFunction(context, handlerParts[1]); // Function(handlerParts[1]);
                if (node.addEventListener) {  // all browsers except IE before version 9
                    node.addEventListener(eventName, function() { eventFunction()}, false);
                } else {
                    if (node.attachEvent) {   // IE before version 9
                        node.attachEvent(eventName, eventFunction() );
                    }
                }
            }
        }
    }

    function setEventHandler(node, context) {
        walkTheDOM(node, applyHandlers, context);
    }

    /**
     * This function binds data object to some internal data structure for applying to the template
     * @param modelName {String} name of the model to be used in the templates
     * @param data {Object} some data structure that provides the real data to be applied to the templates
     */
    function bindModel(modelName, data) {
        self.models[modelName] = data;
    }

    /**
     * This function returns a bound model from it's name
     * @param modelName
     * @returns {*|{}}
     */
    function getModel(modelName) {
        return self.models[modelName] || {};
    }

    function getLoops() {
        var loopNodes;
        loopNodes = parseDocumentForProperties('data-ki-control', 'foreach');
    }

    /**
     * This function parses the document and add all nodes, that have a template assigned to it to the
     * array of templated nodes
     * @param templateKey {String} The node, which has a template attached
     */
    function getTemplatedNode(templateKey) {
        var nodes,
            node,
            i;

        nodes = document.getElementsByTagName('*');     // all nodes
        i = nodes.length;
        while (i > 0) {
            node = nodes[i];
            if (node && node.getAttribute(templateKey) ) {
                // Found a templated node
                self.templatedNodes.push(new TemplatedNode(node));
            }
            i--;
        }
    }

    /**
     * This function applies all templates of the document on the templated nodes
     */
    function applyTemplates() {
        var i,
            templatedNode,
            templateName,
            loopedDummyData,
            dummyData,
            loopArray,
            loopCounter,
            nodeText;

        dummyData = {
            article: {
                title: 'Hello',
                comments: [
                    {
                        text: 'blah1'
                    },
                    {
                        text: 'blah2'
                    }
                ]
            }
        };

        loopedDummyData = [
            {
                text: 'Hello'
            },
            {
                text: 'welcome'
            }
        ];

        i = self.templatedNodes.length;
        while (i > 0) {
            templatedNode = self.templatedNodes[i-1];
            templateName = templatedNode.getTemplateName();
            nodeText='';
            if (templateName != 'missing' && self.templates[templateName]) {
                if(templatedNode.hasLoop()) {
                    loopArray = templatedNode.matchLoopVar(dummyData);
                    loopCounter = 0;
                    while(loopCounter < loopArray.length) {
                        nodeText += applyBindings(loopArray[loopCounter], self.templates[templateName]);
                        loopCounter++;
                    }
                } else {
                    nodeText = applyBindings(dummyData, self.templates[templateName]);
                }
                templatedNode.getNode().innerHTML = nodeText;
                setEventHandler(templatedNode.getNode(), dummyData);
            }
            i--;
        }
    }

    parseDocument();
    getTemplatedNode('data-ki-template');

    return {
        getTemplates: function() {
            return self.templates;
        },
        getTemplatedNodes: function() {
            return self.templatedNodes;
        },
        applyTemplates:  function() {
            applyTemplates();
        }
    }
};