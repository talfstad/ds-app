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
          return this.updateCollection.toJSON();
        }
      });

      //instantiate
      this.updateCollection = new UpdateCollection();
      var updateCollectionBulkSaveModelWrapper = new UpdateCollectionBulkSaveModelWrapper();

      //callbacks
      var onSaveSuccess = function(models, message, other) {
        $.each(models, function(model){
          
          if(model.get('finishedProcessing')){
            var actualModel = this.updateCollection.get(model.id);
            actualModel.set(model.attributes); //this should trigger render
            this.updateCollection.remove(actualModel);
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

