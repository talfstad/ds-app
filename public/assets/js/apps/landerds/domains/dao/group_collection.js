define(["app",
    "assets/js/apps/landerds/domains/dao/group_model"
  ],
  function(Landerds, GroupModel) {
    var GroupCollection = Backbone.Collection.extend({
      url: '/api/groups',
      model: GroupModel,
      comparator: 'group',

      filterOutGroups: function(groupsToFilterOutCollection) {

        var items = new GroupCollection();

        this.each(function(group) {
          groupId = group.get("id");

          if (!groupsToFilterOutCollection.find(function(m) {
              var id = m.get('group_id') || m.get('id')
              return id == groupId
            })) {
            items.add(group);
          }

        });

        return items;
      }

    });


    var API = {
      getGroupCollection: function() {
        var me = this;
        var defer = $.Deferred();


        this.groupCollectionInstance = new GroupCollection();

        this.groupCollectionInstance.fetch({
          success: function(groups) {
            defer.resolve(groups);
          },
          error: function(one, two, three) {
            Landerds.execute("show:login");
          }
        });


        var promise = defer.promise();
        return promise;
      }
    };

    Landerds.reqres.setHandler("domains:groupCollection", function() {
      return API.getGroupCollection();
    });

    return GroupCollection;
  });
