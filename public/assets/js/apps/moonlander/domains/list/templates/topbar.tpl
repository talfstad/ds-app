<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active">
      <a>Domains</a>
    </li>
    <li class="crumb-trail">Showing <%= showing_low %>-<%= showing_high %> of <%= showing_total %></li>
  </ol>

  <div class="right-stats"> 
    <% 
      var lander = "Lander"
      if(total_not_deployed > 1) {
        var lander = "Landers"
      } 
      var totalLander = "Lander"
      if(total_landers > 1) {
        totalLander = "Landers"
      }
      var totalDeployingLander = "Lander"
      if(total_deploying > 1) {
        totalDeployingLander = "Landers"
      }
      var initializingLanderText = "Lander"
      if(total_initializing > 1){ 
        initializingLanderText = "Landers"
      }
      var deletingLanderText = "Lander"
      if(total_deleting > 1){
        deletingLanderText = "Landers"
      }
      var modifiedLanderText = "Lander"
      if(total_modified > 1){
        modifiedLanderText = "Landers"
      }
    %>

      <% if(total_deleting > 0) { %>
      
      <div>
        <span class="badge-danger badge"><%= total_deleting %></span> <%= deletingLanderText %> Deleting
      </div>

      <% } %>

      <% if(total_initializing > 0) { %>
      
      <div>
        <span class="badge-alert badge"><%= total_initializing %></span> <%= initializingLanderText %> Initializing
      </div>

      <% } %>
    
      <% if(total_not_deployed > 0) { %>
      
      <div>
        <span class="badge-primary badge"><%= total_not_deployed %></span> <%= lander %> Not Deployed
      </div>
      
      <% } %>
      
      <% if(total_deploying > 0) { %>

      <div>
        <span class="badge-alert badge"><%= total_deploying %></span> <%= totalDeployingLander %> Working
      </div>
       <% } %>

       <% if(total_modified > 0) { %>

      <div>
        <span class="badge-warning badge"><%= total_modified %></span> <%= modifiedLanderText %> Modified
      </div>

       <% } %>
   

    <!-- <div>
      <span class="badge-success badge">45</span> Deployed
    </div> -->
    <div>
      <span class="badge-light badge"><%= total_landers %></span> Total <%= totalLander %>
    </div>
  </div>
</div>