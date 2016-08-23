<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active" style="font-size: 20px; color: #222">
      <span style="position: relative; top: 1px" class="icon-domains_icon"></span>
      <span>Domains</span>
    </li>
    <li class="crumb-trail">Showing <%= showing_low %>-<%= showing_high %> of <%= showing_total %></li>
  </ol>

  <div class="right-stats"> 

<% 
      var total_domains = "Domain"
      if(total > 1 || total < 1) {
        total_domains = "Domains"
      }

      var deletingDomainText = "Domain"
      if(total_deleting > 1 || total_deleting < 1){
        deletingDomainText = "Domains"
      }

      var deployingDomainsText = "Domain"
      if(total_deploying > 1 || total_deploying < 1) {
        deployingDomainsText = "Domains"
      }

      var undeployingDomainsText = "Domain"
      if(total_undeploying > 1 || total_undeploying < 1) {
        deployingDomainsText = "Domains"
      }

      var totalWorkingDomain = "Domain"
      var total_working = parseInt(total_undeploying) + parseInt(total_deploying)
      if(total_working > 1 || total_working < 1) {
        totalWorkingDomain = "Domains"
      }

  if(total_deleting > 0) { %>
      
      <div>
        <span class="badge-danger badge"><%= total_deleting %></span> <%= deletingDomainText %> Deleting
      </div>

  <% } %>

      <% if(total_working > 0) { %>
      <div>
        <span class="badge-alert badge"><%= total_working %></span> <%= totalWorkingDomain %> Working
      </div>
       <% } %>

    <div>
      <span class="badge-light badge"><%= total %></span> Total <%= total_domains %>
    </div>
  </div>
</div>
