define(["app",
    "assets/js/apps/landerds/landers/dao/group_model"
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
              var id = m.get('group_id') || m.get('id');
              return id == groupId
            })) {
            items.add(domain);
          }
        });

        return items;
      }

    });

    var groupCollectionInstance = null;

    var API = {
      getGroupCollection: function() {
        var me = this;
        var defer = $.Deferred();

        if (!this.groupCollectionInstance) {

          this.groupCollectionInstance = new GroupCollection();

          this.groupCollectionInstance.fetch({
            success: function(groups) {
              defer.resolve(groups);
            },
            error: function(one, two, three) {
              Landerds.execute("show:login");
            }
          });
        } else {
          //async hack to still return defer
          setTimeout(function() {
            defer.resolve(me.groupCollectionInstance);
          }, 100);
        }

        var promise = defer.promise();
        return promise;
      }
    };

    Landerds.reqres.setHandler("landers:groupCollection", function() {
      return API.getGroupCollection();
    });

    return GroupCollection;
  });
