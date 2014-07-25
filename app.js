requirejs.config({
    'paths': {
        'model'         : 'app/js/model',
        'view'          : 'app/js/view',
        'jquery'        : 'vendor/js/jquery-2.1.1.min',
        'underscore'    : 'vendor/js/underscore',
        'backbone'      : 'vendor/js/backbone',
        'text'          : 'vendor/js/text'
    },

    'shim': {
        'underscore': {
            'exports': '_'
        },
        'backbone': {
            'deps': ['jquery', 'underscore'],
            'exports': 'Backbone'
        }
    }
});

// ENTRY POINT - INITIALIZE!
require(['jquery', 'model', 'view', 'text!app/assets/topics.json'], function($, Models, Views, json) {
    var jsonTopics = JSON.parse(json).topics;

    var topics = new Models.TopicList(jsonTopics);
    // Trigger this manually as the models are not ready when the collection is initialized.`
    topics.recalculateImportances();

    var $cloud = new Views.List({collection: topics});
});

