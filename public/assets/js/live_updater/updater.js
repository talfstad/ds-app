define(["app"], function(Moonlander){
  
  Moonlander.updater = {

    updateCollection: null,

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
      var onSaveSuccess = function(model, modelData, other) {
        $.each(modelData, function(idx, modelAttributes){
          //anything in the collection should have processing = true or error
          if(modelAttributes.processing === 'error'){
            
            //TODO growl a message that the user needs to do XYZ
            var errorMsg = modelAttributes.errorMsg;


          }
          else if(!modelAttributes.processing){
            //done, update original model
            var actualModel = me.updateCollection.get(modelAttributes.id);
            actualModel.set(modelAttributes); //this should trigger render
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

    //checks if model needs to be added to the updateCollection
    //this is called by models on their initialization and is meant
    //to determine whether or not a model needs updating
    register: function(model) {
      if(model.get("processing")) {
        Moonlander.updater.add(model);
      }
    },

    //adds a model to the updater
    add: function(model) {
      this.updateCollection.add(model);
    }
  };


  return Moonlander.updater;
});

