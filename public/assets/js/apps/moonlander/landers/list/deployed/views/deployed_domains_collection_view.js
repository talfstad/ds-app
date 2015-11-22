define(["app",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domain_row_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_empty_view.js"
  ],
  function(Moonlander, DeployedDomainRowView, EmptyView) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(Deployed, Moonlander, Backbone, Marionette, $, _) {
      Deployed.ChildView = Marionette.CollectionView.extend({
        tagName: "tbody",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          model.set('urlEndpoints', this.collection.urlEndpoints);
          model.set('landerName', this.collection.landerName);
          model.set('deployStatus', this.collection.deployStatus);
        },
       
        onRender: function(){

          this.$el.find(".domain-link").click(function(e) {
            //get the val from select box
            var domainEndpointSelectValue = $(e.currentTarget).parent().find("select").val();
            var domainLinkHref = $(e.currentTarget).text();
            //go to the full page
            $(e.currentTarget).attr("href", "http://" + domainLinkHref + domainEndpointSelectValue);
          });

          this.$el.find(".domain-link").hover(function(e) {
            //get next select
            var domainEndpointSelect = $(e.currentTarget).parent().find("select");

            //underline it or undo underline if already applied
            if (domainEndpointSelect.hasClass("domain-link-hover")) {
              domainEndpointSelect.removeClass("domain-link-hover");
            } else {
              domainEndpointSelect.addClass("domain-link-hover");
            }
         });
        }
        
      });
    });
    return Moonlander.LandersApp.Landers.List.Deployed.ChildView;
  });
