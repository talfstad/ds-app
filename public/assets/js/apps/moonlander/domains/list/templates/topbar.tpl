<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active">
      <a>Domains</a>
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

  if(total_deleting > 0) { %>
      
      <div>
        <span class="badge-danger badge"><%= total_deleting %></span> <%= deletingDomainText %> Deleting
      </div>

  <% } %>

    <div>
      <span class="badge-light badge"><%= total %></span> Total <%= total_domains %>
    </div>
  </div>
</div>
