define(["app"], function(Landerds) {

  Landerds.updater = {

    updateCollection: null,

    pollNotStarted: true,

    initialize: function() {
      var me = this;

      //definitions
      var UpdateCollection = Backbone.Collection.extend({
        // model: Backbone.Model.extend({})
      });

      //collection wrapper to save collection at once
      var UpdateCollectionBulkSaveModelWrapper = Backbone.Model.extend({
        urlRoot: '/api/updater',
        toJSON: function() {
          return me.updateCollection.toJSON();
        }
      });

      //instantiate
      this.updateCollection = new UpdateCollection();
      var updateCollectionBulkSaveModelWrapper = new UpdateCollectionBulkSaveModelWrapper();
      updateCollectionBulkSaveModelWrapper.set("models", this.updateCollection);

      //callbacks
      var removeIfFinishedProcessing = function(model, modelData, other) {
        if (me.updateCollection.length <= 0) return;

        $.each(modelData, function(idx, modelAttributes) {
          var actualJobModel = me.updateCollection.get(modelAttributes.id);
          if (!modelAttributes.processing) {
            //done, update original model
            if (modelAttributes.error) {
              actualJobModel.set("error", modelAttributes.error_code);
              actualJobModel.trigger("errorState", actualJobModel);
            } else {
              actualJobModel.trigger("finishedState", actualJobModel, modelAttributes);
              me.updateCollection.remove(actualJobModel);
            }
          } else {
            actualJobModel.trigger("updateJobModel", modelAttributes);
          }
        });
      };

      var intervalLength = 1000 * 10; //10 seconds

      this.poll = function() {
        setTimeout(function() {

          updateCollectionBulkSaveModelWrapper.save({}, {
            success: function(model, modelData, other) {
              removeIfFinishedProcessing(model, modelData, other);
              if (me.updateCollection.length > 0) {
                me.poll();
              } else {
                me.pollNotStarted = true;
              }
            }
          });
        }, intervalLength);
      };
    },

    //adds a model to the updater only if it should add it! if the job its
    //trying to add is in conflict with another job already being updated it won't
    //add it to the updater. the job will be started when the conflicting job is
    //finished in the finishedState function
    add: function(model) {

      this.updateCollection.add(model);

      var attr = {
        actualAddedJobModel: model
      };

      model.trigger("startState", attr);


      //start polling if first one.
      //function is self perpetuating so no need to call it for more than 1 model
      if (this.pollNotStarted) {
        this.pollNotStarted = false;
        this.poll();
      }

    },

    remove: function(model) {
      this.updateCollection.remove(model);
    }

  };


  return Landerds.updater;
});
