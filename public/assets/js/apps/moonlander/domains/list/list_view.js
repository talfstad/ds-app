define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/domains_list.tpl",
    "bootstrap"
  ],
  function(Moonlander, domainsListTpl) {

    Moonlander.module("DomainsApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.ItemView.extend({

        template: domainsListTpl,
        tagName: "section",
        id: "content_wrapper",

        onDomRefresh: function() {

          // temp js to show usage.
          $('#domainsList').on('show.bs.collapse', function() {
            $('a[href="#domainsList"] span:first').addClass('fa-minus').removeClass('fa-plus');
          });

          $('#domainsList').on('hidden.bs.collapse', function() {
            if (!(($("#domainsList").attr("aria-expanded") === "true"))) {
              $('a[href="#domainsList"] span:first').addClass('fa-plus').removeClass('fa-minus');
            }
          });

          $('#campaignsList').on('shown.bs.collapse', function() {
            $('a[href="#campaignsList"] span:first').addClass('fa-minus').removeClass('fa-plus');
          });

          $('#campaignsList').on('hidden.bs.collapse', function() {
            $('a[href="#campaignsList"] span:first').addClass('fa-plus').removeClass('fa-minus');
          });

          $('#domainsList1').on('show.bs.collapse', function() {
            $('a[href="#domainsList1"] span:first').addClass('fa-minus').removeClass('fa-plus');
          });

          $('#domainsList1').on('hidden.bs.collapse', function() {
            if (!(($("#domainsList1").attr("aria-expanded") === "true"))) {
              $('a[href="#domainsList1"] span:first').addClass('fa-plus').removeClass('fa-minus');
            }
          });

          $('#campaignsList1').on('shown.bs.collapse', function() {
            $('a[href="#campaignsList1"] span:first').addClass('fa-minus').removeClass('fa-plus');
          });

          $('#campaignsList1').on('hidden.bs.collapse', function() {
            $('a[href="#campaignsList1"] span:first').addClass('fa-plus').removeClass('fa-minus');
          });

          $('#campaignsList2').on('shown.bs.collapse', function() {
            $('a[href="#campaignsList2"] span:first').addClass('fa-minus').removeClass('fa-plus');
          });

          $('#campaignsList2').on('hidden.bs.collapse', function() {
            $('a[href="#campaignsList2"] span:first').addClass('fa-plus').removeClass('fa-minus');
          });

          $("label[data-action='expand-all']").click(function() {
            $(".collapse").collapse('show');
          });

          $("label[data-action='collapse-all']").click(function() {
            $(".collapse").collapse('hide');
          });

          //needed to init correctly. avoids initial toggle on button click (expand/collapse all)
          $(".collapse").collapse({
            toggle: false
          });

          $("body").removeClass("external-page");
        }

      });


    });
    return Moonlander.DomainsApp.List.View;
  });
