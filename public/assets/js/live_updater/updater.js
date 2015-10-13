define(["app"], function(Moonlander){
  
  Moonlander.updater = {

    updateCollection: null,

    initialize: function() {
      var me = this;

      //definitions
      var UpdateCollection = Backbone.Collection.extend({
        model: Backbone.Model.extend({})
      });

      var UpdateCollectionBulkSaveModelWrapper = Backbone.Model.extend({
        urlRoot: '/api/updater',  //url to put to
        toJSON: function(){
          return me.updateCollection.toJSON();
        }
      });

      //instantiate
      this.updateCollection = new UpdateCollection();
      var updateCollectionBulkSaveModelWrapper = new UpdateCollectionBulkSaveModelWrapper();

      //callbacks
      var onSaveSuccess = function(model, modelData, other) {
        $.each(modelData, function(idx, model){
          //anything in the collection should have processing = true unless done
          if(!model.processing){
            //done, update original model
            var actualModel = me.updateCollection.get(model.id);
            actualModel.set(model); //this should trigger render
            me.updateCollection.remove(actualModel);
          }
          
        });
      };
      
      //init the interval
      var intervalLength = 3000;
      var updateInterval = setInterval(function() {
        //if nothing to update, dont call save on interval
        if(me.updateCollection.length >= 1) {
          //things to update
          updateCollectionBulkSaveModelWrapper.save({}, {
            success: onSaveSuccess
          });
        }
      }, intervalLength);

    },

    //adds a model to the updater
    add: function(model) {
      this.updateCollection.add(model);
    }
  };


  return Moonlander.updater;
});

