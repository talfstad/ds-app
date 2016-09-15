define(["app",
    "assets/js/apps/landerds/domains/dao/group_model"
  ],
  function(Landerds, GroupsModel) {
    var GroupsCollection = Backbone.Collection.extend({
      url: '/api/groups',
      model: GroupsModel,
      comparator: 'group',

      filterOutGroups: function(groupsToFilterOutCollection) {

        var items = new GroupsCollection();

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
      getGroupsCollection: function() {
        var me = this;
        var defer = $.Deferred();


        this.groupCollectionInstance = new GroupsCollection();

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

    Landerds.reqres.setHandler("domains:groupsCollection", function() {
      return API.getGroupsCollection();
    });

    return GroupsCollection;
  });
