define(["app"], function(Moonlander){
  
  Moonlander.updater = {

    updateCollection: null,

    pollNotStarted: true,

    initialize: function() {
      var me = this;

      //definitions
      var UpdateCollection = Backbone.Collection.extend({
        model: Backbone.Model.extend({})
      });

      //collection wrapper to save collection at once
      var UpdateCollectionBulkSaveModelWrapper = Backbone.Model.extend({
        urlRoot: '/api/updater',
        toJSON: function(){
          return me.updateCollection.toJSON();
        }
      });

      //instantiate
      this.updateCollection = new UpdateCollection();
      var updateCollectionBulkSaveModelWrapper = new UpdateCollectionBulkSaveModelWrapper();

      //callbacks
      var removeIfFinishedProcessing = function(model, modelData, other) {
        if(me.updateCollection.length <= 0) return;
        // use activeJobs array to see if its done processing
        $.each(modelData, function(idx, modelAttributes){
          if(!modelAttributes.processing){
            //done, update original model
            var actualJobModel = me.updateCollection.get(modelAttributes.id);
            actualJobModel.trigger("finishedState", actualJobModel);
            //hack to get it to not send DELETE XHR
            delete actualJobModel.attributes.id;
            actualJobModel.destroy();
          }
        });
      };

      var intervalLength = 10000;

      this.poll = function() {
        setTimeout(function(){
      
          updateCollectionBulkSaveModelWrapper.save({}, {
            success: function(model, modelData, other) {
              removeIfFinishedProcessing(model, modelData, other);
              if(me.updateCollection.length >= 1) {
                  me.poll();
              } else {
                me.pollNotStarted = true;
              }
            }
          });        
        }, intervalLength);
      };
    },

    //adds a model to the updater
    add: function(model) {
      this.updateCollection.add(model);

      //start polling if first one.
      //function is self perpetuating so no need to call it for more than 1 model
      if(this.pollNotStarted) {
        this.pollNotStarted = false;
        this.poll();
      }
    },

    remove: function(model){
      this.updateCollection.remove(model);
    }

  };


  return Moonlander.updater;
});

