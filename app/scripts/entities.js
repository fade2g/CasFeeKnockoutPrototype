/**
 * Created by holger on 09.06.2014.
 */
CASFEE.namespace('CASFEE.entities');

CASFEE.entities = (function () {

    var articleBuilder = function(articleData) {
        var self = this;
        var listeners = [];

        function genericSetter(property, value) {
            self[property] = value;
        };

        function addListener(listener) {

        }

        self.id = articleData.id;
        self.title = articleData.title;
        self.url = articleData.url;
        self.description = articleData.description;
        self.votes = articleData.votes || 0;
        self.submissionDate = articleData.submissionDate ? new Date(articleData.submissionDate) : new Date();
        self.numberOfComment = articleData.numberOfComments || 0;
        self.author = articleData.author;

        function _getID() {

        }

        return {
            getId: function() {
                return self.id;
            },
            getUrl: function() {
                return self.url;
            },
            getTitle: function() {
                return self.title;
            },
            getDescription: function() {
                return self.description;
            },
            getVotes: function() {
                return self.votes;
            },
            getSubmissionDate: function() {
                return self.submissionDate;
            },
            getNumberOfComments: function() {
                return self.numberOfComment;
            }
        }
    }

    return {
        get: function(name) {
            return my_constants[name];
        }
    };
})();