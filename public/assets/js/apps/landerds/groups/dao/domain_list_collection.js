define(["app",
    "assets/js/apps/landerds/groups/dao/domain_list_model"
  ],
  function(Landerds, DomainListModel) {

    var DomainListCollection = Backbone.Collection.extend({
      model: DomainListModel,
      comparator: function(doc) {
        var str = doc.get('domain') || '';
        return str.toLowerCase();
      }
    });


    return DomainListCollection;
  });