define(['backbone'], function (Backbone) {
    "use strict";
 
    // 6 levels of importance.
    var TopicModelImportanceLevels = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

    var TopicModel = Backbone.Model.extend({
        // Loaded json doesn't contain 'importance', so it should be calculated based on
        //  the 'volume' values for all topics. Default/start value is 1.
        // The min value is 1, max is enumImportance.length-1.
        defaults: {
            importance: 1
        }
    }),

    TopicList = Backbone.Collection.extend({
        model: TopicModel,
        
        // The collection should be sorted by the models' volume value.
        comparator: 'volume',

        initialize: function (models, options) {
            var self = this;

            // When member's volume is changed, resort the collection
            //  and recalculate importance values of the members.
            this.on('change:volume', function (model, value) {
                self.sort();
                self.recalculateImportances();
            });
        },

        // Simple algorithm to calculate importances. All collection members are equaly(-ish)
        //  split into as many categories as there are enumImportance values (i.e. importance 
        //  levels). Meaning that if there are 100 members and 5 importance levels, the first 
        //  20 members will have importance 5, the following 20 will have importance 4 etc.
        // Of course, this algorithm can be more complex, for example, taking into account 
        //  distribution and repetition/density of certain volumes etc. For a coding challenge, 
        //  I hope this is good enough.
        recalculateImportances: function (models) {
            var importanceRange = 0,
                volumesCount = TopicModelImportanceLevels.length;

            _.each(this.models, function (el, ind) {
                el.set('importance', volumesCount - importanceRange - 1);
                if (ind % volumesCount === 0) {
                    importanceRange++;
                }
            });
        }
    })
 
    return {
        TopicModelImportanceLevels: TopicModelImportanceLevels,
        TopicModel: TopicModel,
        TopicList: TopicList
    };
 
});
