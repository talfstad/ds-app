<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active" style="font-size: 20px; color: #222">
      <span style="position: relative; top: 1px" class="icon-landers_icon"></span>
      <span>Landing Pages</span>
    </li>
    <li class="crumb-trail">Showing <%= showing_low %>-<%= showing_high %> of <%= showing_total %></li>
  </ol>

  <div class="right-stats"> 
    <% 
      var lander = "Lander"
      if(total_not_deployed > 1 || total_not_deployed < 1) {
        var lander = "Landers"
      } 
      var totalLander = "Lander"
      if(total > 1 || total < 1) {
        totalLander = "Landers"
      }

      var totalWorkingLander = "Lander"
      var total_working = parseInt(total_undeploying) + parseInt(total_deploying)
      if(total_working > 1 || total_working < 1) {
        totalWorkingLander = "Landers"
      }

      var initializingLanderText = "Lander"
      if(total_initializing > 1 || total_initializing < 1){ 
        initializingLanderText = "Landers"
      }
      var deletingLanderText = "Lander"
      if(total_deleting > 1 || total_deleting < 1){
        deletingLanderText = "Landers"
      }
      
      var modifiedLanderText = "Lander"
      if(total_modified > 1 || total_modified < 1){
        modifiedLanderText = "Landers"
      }

      total_modified = 0;
    %>

      <% if(total_deleting > 0) { %>
      
      <div>
        <span class="badge-danger badge"><%= total_deleting %></span> <%= deletingLanderText %> Deleting
      </div>

      <% } %>

      <!-- <% if(total_initializing > 0) { %>
      
      <div>
        <span class="badge-alert badge"><%= total_initializing %></span> <%= initializingLanderText %> Initializing
      </div>

      <% } %> -->
    
      <!-- <% if(total_not_deployed > 0) { %>
      
      <div>
        <span class="badge-primary badge"><%= total_not_deployed %></span> <%= lander %> Not Deployed
      </div>
      
      <% } %> -->
      
      <% if(total_working > 0) { %>

      <div>
        <span class="badge-alert badge"><%= total_working %></span> <%= totalWorkingLander %> Working
      </div>
       <% } %>


       <% if(total_modified > 0) { %>

      <div>
        <span class="badge-warning badge"><%= total_modified %></span> <%= modifiedLanderText %> Outdated
      </div>

       <% } %>
   

    <!-- <div>
      <span class="badge-success badge">45</span> Deployed
    </div> -->
    <div>
      <span class="badge-light badge"><%= total %></span> Total <%= totalLander %>
    </div>
  </div>
</div>