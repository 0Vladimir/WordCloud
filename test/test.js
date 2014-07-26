define([ 'chai', 'model', 'view', 'text!app/assets/topics.json', 'chai-jquery'], function( chai, Models, Views, strTopics) {
  var expect = chai.expect;

  describe('Models', function() {

      describe('Sample Model', function() {
          it('default importance should be 1', function() {
              var sample = new Models.TopicModel();
              sample.get('importance').should.equal(1);
          });
      });

      describe('Models List', function () {
          var list = new Models.TopicList(JSON.parse(strTopics).topics);
          list.recalculateImportances();

          it('should have 30 elements loaded from topics.json', function () {
              list.models.length.should.equal(30);
          });

          it('first element should have importance 5', function () {
              list.at(0).get('importance').should.equal(5);    
          });

          it('first element should have importance 0', function () {
              list.at(29).get('importance').should.equal(0);
          });

          it('the last element should be promoted to first if its volume is changed to be highest', function() {
              var last = list.at(0);
              var id = last.get('id');
              last.set('volume', list.at(29).get('volume') + 1);
              list.at(29).get('id').should.equal(id);
              list.at(29).get('importance').should.equal(0);
          });

      });


      describe('Views', function () {
          var $cloud, 
              $words;

          before(function () {
              var topics = new Models.TopicList(JSON.parse(strTopics).topics);
              topics.recalculateImportances();
              $cloud = new Views.List({collection: topics, toCalculate: false });
              $words = $cloud.$el.find('.word');
          });

          it('words should have css classes set based on their volume/importance', function() {
              expect($words.eq(0)).to.have.class('positive');
              expect($words.eq(1)).to.have.class('negative');
              expect($words.eq(0)).to.have.class('text-xxl');
              expect($words.eq(29)).to.have.class('text-xs');
          });

          it('info panel should be visible and populated after clicking a word', function () {
              expect($('#metadata')).to.be.empty;
              $words.eq(0).trigger('click');
              expect($('#metadata')).not.to.be.empty;
              expect($('#metadata').find('h2')).to.have.html('Information on topic: Berlin');
              expect($('#metadata').find('h3')).to.have.html('Total mentions: 165');
              expect($('#metadata').find('.positive')).to.have.html('29');
              expect($('#metadata').find('.negative')).to.have.html('3');
          });

          it('the words shouldn\'t intersect', function () {
              // This is an approximation because getBoundingClientRect() in Javascript
              // does not wrap tightly around text, so there is some empty space around text nodes.
              var $w = $words[0];
              var bb = $w.getBoundingClientRect();

              var testIntersection = function($w1, $w2) {
                  var bb1 = $w1.getBoundingClientRect();
                  var bb2 = $w2.getBoundingClientRect();

                  return !(bb2.left > bb1.right || 
                           bb2.right < bb1.left || 
                           bb2.top > bb1.bottom ||
                           bb2.bottom < bb1.top);
              }

              var isIntersection = false;
              $words.each(function(index, $word1) {
                  $words.each(function(index, $word2) {
                      if ($word1 !== $word2 && !isIntersection) {
                          if(testIntersection($word1, $word2)) {
                              isIntersection = true;
                          }
                      }
                  });
              });
              chai.assert.notOk(isIntersection, 'There are words that intersect');
          });

      });

 
  });
 
});
