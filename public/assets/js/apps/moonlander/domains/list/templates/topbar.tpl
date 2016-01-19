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
   
    %>

    <div>
      <span class="badge-light badge"><%= total %></span> Total <%= total_domains %>
    </div>
  </div>
</div>