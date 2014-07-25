requirejs.config({
    'baseUrl': '../',
    'paths': {
        'model'         : 'app/js/model',
        'view'          : 'app/js/view',
        'jquery'        : 'vendor/js/jquery-2.1.1.min',
        'underscore'    : 'vendor/js/underscore-min',
        'backbone'      : 'vendor/js/backbone-min',
        'text'          : 'vendor/js/text',
        'mocha'         : 'node_modules/mocha/mocha',
        'chai'          : 'node_modules/chai/chai',
        'chai-jquery'   : 'vendor/js/chai-jquery'
  },

    'shim': {
        'underscore': {
            'exports': '_'
        },
        'backbone': {
            'deps': ['jquery', 'underscore'],
            'exports': 'Backbone'
        },
        'chai-jquery': ['jquery', 'chai']
    }
});

require(['require', 'chai', 'chai-jquery', 'mocha', 'jquery'], function(require, chai, chaiJquery){
    var should = chai.should();
    chai.use(chaiJquery);
   
    mocha.setup('bdd');
   
    require(['test.js'], 
        function(require) {
            mocha.run();
        }
    );
 
});

