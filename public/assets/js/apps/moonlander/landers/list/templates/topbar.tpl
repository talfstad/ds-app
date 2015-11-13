<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active">
      <a>Landing Pages</a>
    </li>
    <li class="crumb-trail">Showing <%= showing_low %>-<%= showing_high %> of <%= showing_total %></li>
  </ol>

  <div class="right-stats"> 
    <% if(total_not_deployed == 0 && total_deploying == 0) { %>

    <div>
      <span class="badge-success badge"><%= total_landers %></span> Deployed
    </div>

    <% } else { %>
    
      <% if(total_not_deployed > 0) { %>
      
      <div>
        <span class="badge-danger badge"><%= total_not_deployed %></span> Not Deployed
      </div>
      
      <% } %>
      
      <% if(total_deploying > 0) { %>

      <div>
        <span class="badge-warning badge"><%= total_deploying %></span> Deploying
      </div>
       <% } %>
    
    <% } %>

    <!-- <div>
      <span class="badge-success badge">45</span> Deployed
    </div> -->
    <div>
      <span class="badge-primary badge"><%= total_landers %></span> Total Landers
    </div>
  </div>
</div>