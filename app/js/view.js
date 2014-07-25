define(['jquery', 
        'backbone', 
        'underscore', 
        'model', 
        'text!app/tmpl/word.html', 
        'text!app/tmpl/info.html'], 
    function ($, Backbone, _, Model, tplWord, tplInfo) {
     
        "use strict";

        // Generate css classes for text size based on the available importance levels from the model.     
        var enumImportance = function (argument) {
                var cssClasses = [];

                _.each(Model.TopicModelImportanceLevels, function (el) {
                    cssClasses.push('text-' + el);
                });

                return cssClasses;
            }(),
            thresholdPositive = 60,
            thresholdNegative = 40;

        var Word = Backbone.View.extend({
                template: _.template(tplWord),

                className: 'word',

                initialize: function () {
                    var self = this;

                    // When a word is clicked, show its info in a separate view.
                    this.$el.on('click', function () {
                       new Info({model: self.model});
                    });
                },

                render: function () {
                    this.$el.html( this.template(this.model.toJSON()) );

                    // Set css class based on the value of importance.
                    this.$el.addClass(enumImportance[this.model.get('importance')]);

                    // Set css class based on the value of sentimentScore.
                    var sentimentScore = this.model.get('sentimentScore');
                    if (sentimentScore > thresholdPositive) {
                        this.$el.addClass('positive');
                    }
                    else if (sentimentScore < thresholdNegative) {
                        this.$el.addClass('negative');   
                    }

                    return this;
                }
            }),

            // View which displays topic metadata when a word is clicked.
            Info = Backbone.View.extend({
                el: '#metadata',

                template: _.template(tplInfo),// _.template($('#tmpl-metadata-box').html()),

                initialize: function () {
                    this.render();
                },

                render: function () {
                    this.$el.html( this.template(this.model.toJSON()) );
                    return this;
                }
            }),

            List = Backbone.View.extend({
                el: '#cloud',

                initialize: function (options) {
                    this.options = options || {};
                    this.render();
                    this.listenTo(this.collection, 'change', this.render);
                },

                // Positioning words in a word cloud is a science on its own. This is very simplified 
                //  version. It is not 100% precise, so the comments and var names are not mathematically 
                //  always correct, but even so, they should be easy to follow and understand.
                // The gist is to start at the vertical center, keep the vertical coordinate constant 
                //  as long as possible while changing the horizontal. If there isn't enough place, 
                //  move up/down (alternately) and start all over for the new vertical coordinate.
                render: function () {
                    this.$el.empty();

                    // Bounds of the parent container
                    var containerBounds = this.el.getBoundingClientRect();
                    // Randomize the initial x coordinate
                    var currX = Math.random() * (containerBounds.width/2) + containerBounds.left;
                    // Start at the vertical center
                    var currY = containerBounds.top + containerBounds.height/2;

                    // Leftmost and rightmost coordinates in the current "line"
                    var leftmost = currX;
                    var rightmost = currX;
                    // Top and bottom of the words rendered so far
                    var bottommost = currY;
                    var topmost = currY;

                    // Whenever the horizontal "line" is full, go up or down alternately
                    var direction = 1;
                    // Leave some room around the words
                    var margin = 5;

                    // Start at the end, as that's the most important word and it should be at the center
                    for (var i = this.collection.length - 1; i >= 0; i--) {
                        var topic = this.collection.at(i);
                        var $topic = new Word({model: topic});
                        this.$el.append($topic.render().el);

                        // Bounds of the current word
                        var box = $topic.el.getBoundingClientRect();

                        // If there is enough room to the right of the word, place it there
                        if (rightmost + box.width < containerBounds.left + containerBounds.width) {
                            currX = rightmost + margin;
                            rightmost += box.width + margin;
                        }
                        // If there's not room to the right, try to the left, or else shift up/down
                        else {
                            // If there is enough room to the right
                            if (leftmost - box.width > containerBounds.left) {
                                currX = leftmost - box.width - margin;
                                leftmost = currX - margin;
                            }
                            // If there's not room at the same vertical line, go up/down and start over
                            else {
                                // Randomize the x coordinate in the new line
                                currX = Math.random() * (containerBounds.width/2) + containerBounds.left;

                                // Depending on the direction, move upwards/downwards and reset the helpers
                                direction > 0 ? 
                                    currY = bottommost = bottommost + box.height + margin :
                                    currY = topmost = topmost - box.height - margin;

                                // Change the direction for the next new line
                                direction *= -1;

                                // Reset the leftmost and rightmost of the vertical line
                                leftmost = currX - margin;
                                rightmost = currX + box.width + margin;

                            }
                        }

                        $topic.$el.css({left: currX, top: currY});
                    }

                    return this;
                }
            });
     
        return {
            Word: Word,
            Info: Info,
            List: List
        };
 
});
