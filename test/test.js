define([ 'chai', 'model', 'view', 'text!app/assets/topics.json', 'chai-jquery'], function( chai, Models, Views, strTopics) {
  var expect = chai.expect;

  describe('Models', function() {

      describe('Sample Model', function() {
          it('default importance should be 1', function() {
              var sample = new Models.TopicModel();
              sample.get('importance').should.equal(1);
          });
      });

      describe('List', function () {
          var list = new Models.TopicList(JSON.parse(strTopics).topics);
          list.recalculateImportances();

          it('should have 30 elements loaded from topics.json', function () {
              list.models.length.should.equal(30);
          });

          it('first should have importance 5', function () {
              list.at(0).get('importance').should.equal(5);    
          });

          it('first should have importance 0', function () {
              list.at(29).get('importance').should.equal(0);
          });

          it('change volume on last, promote to first', function() {
              var last = list.at(0);
              var id = last.get('id');
              last.set('volume', list.at(29).get('volume') + 1);
              list.at(29).get('id').should.equal(id);
              list.at(29).get('importance').should.equal(0);
          });

      });


      describe('Views', function () {
          var $cloud;

          before(function () {
              var topics = new Models.TopicList(JSON.parse(strTopics).topics);
              topics.recalculateImportances();
              $cloud = new Views.List({collection: topics, toCalculate: false });
          });

          it('test css classes depending on sentiment and volume', function() {
              expect($cloud.$el.find('.word').eq(0)).to.have.class('positive');
              expect($cloud.$el.find('.word').eq(1)).to.have.class('negative');
              expect($cloud.$el.find('.word').eq(0)).to.have.class('text-xxl');
              expect($cloud.$el.find('.word').eq(29)).to.have.class('text-xs');
          });

          it('test info panel', function () {
              expect($('#metadata')).to.be.empty;
              $cloud.$el.find('.word').eq(0).trigger('click');
              expect($('#metadata')).not.to.be.empty;
              expect($('#metadata').find('h2')).to.have.html('Information on topic: Berlin');
              expect($('#metadata').find('h3')).to.have.html('Total mentions: 165');
              expect($('#metadata').find('.positive')).to.have.html('29');
              expect($('#metadata').find('.negative')).to.have.html('3');
          });

      })

 
  });
 
});
