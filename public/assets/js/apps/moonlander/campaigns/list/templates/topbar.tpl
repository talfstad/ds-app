<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active">
      <a>Campaigns</a>
    </li>
    <li class="crumb-trail">Showing <%= showing_low %>-<%= showing_high %> of <%= showing_total %></li>
  </ol>

  <div class="right-stats"> 

<% 
      var total_domains = "Campaign"
      if(total > 1 || total < 1) {
        total_domains = "Campaigns"
      }

      var deletingCampaignText = "Campaign"
      if(total_deleting > 1 || total_deleting < 1){
        deletingCampaignText = "Campaigns"
      }

      var deployingCampaignsText = "Campaign"
      if(total_deploying > 1 || total_deploying < 1) {
        deployingCampaignsText = "Campaigns"
      }

  if(total_deleting > 0) { %>
      
      <div>
        <span class="badge-alert badge"><%= total_deleting %></span> <%= deletingCampaignText %> Deleting
      </div>

  <% }

    if(total_deploying > 0) { %>
      
      <div>
        <span class="badge-alert badge"><%= total_deploying %></span> <%= deployingCampaignsText %> Working
      </div>

  <% } %>


    <div>
      <span class="badge-light badge"><%= total %></span> Total <%= total_domains %>
    </div>
  </div>
</div>
