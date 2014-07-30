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

        // Sligthly more advanced algorithm to calculate importances. The volumes are divided
        //  into ranges of equal length, where each range is one level of importance.
        // Example. Minimum volume: 3, maximal volume: 165, importance levels: 6.
        //  (165 - 3) / 6 = 27, which means that the importances will be distributed as follows:
        //  1: 3..29, 2: 30..56, 3: 57..83, 4: 111..138, 5: 138..165.
        // Of course, this algorithm can be more complex.
        recalculateImportances: function () {
            var importanceRange = 0,
                volumesCount = TopicModelImportanceLevels.length,
                volumes = _.map(this.models, function (model) {
                        return model.get('volume');
                    });

            var maxVolume = _.max(volumes),
                // subtract 1 to push the lowest volumes into step1 (instead of step0)
                minVolume = _.min(volumes) - 1, 
                rangeLength = (maxVolume - minVolume) / volumesCount;

            _.each(this.models, function (el, ind) {
                var importance = volumesCount - (el.get('volume') - minVolume) / rangeLength ;
                el.set('importance', parseInt(importance));
            });

        }
    })
 
    return {
        TopicModelImportanceLevels: TopicModelImportanceLevels,
        TopicModel: TopicModel,
        TopicList: TopicList
    };
 
});
