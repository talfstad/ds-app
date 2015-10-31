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
            actualJobModel.removeFinishedJobFromGuiModel();
            // actualJobModel.set(modelAttributes); //this should trigger model to call correct state update
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

      
      // //init the interval
      // var updateInterval = setInterval(function() {
      //   //if nothing to update, dont call save on interval
      //   if(me.updateCollection.length >= 1) {
      //     //things to update
      //     updateCollectionBulkSaveModelWrapper.save({}, {
      //       success: onSaveSuccess
      //     });
      //   }
      // }, intervalLength);
    },

    //checks if model needs to be added to the updateCollection
    //this is called by models on their initialization and is meant
    //to determine whether or not a model needs updating
    register: function(model) {
      if(model.get("processing")) {
        Moonlander.updater.add(model);
      }
    },

    reset: function(){
      this.updateCollection.reset();
    },

    removeJobsByIds: function(jobIdArray){
      var me = this;
      $.each(jobIdArray, function(idx, jobIdToRemove){
        me.updateCollection.remove(jobIdToRemove);
      });
    },

    isAlreadyUpdating: function(jobAttributes){
      //if no id on job attributes then its brand new
      var isAlreadyUpdating = false;
      if(jobAttributes.id) {
        //check if jobAttributes is in the updater
        this.updateCollection.each(function(job){
          if(jobAttributes.id === job.id){
            isAlreadyUpdating = true;
          }
        });
      }

      return isAlreadyUpdating;
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

