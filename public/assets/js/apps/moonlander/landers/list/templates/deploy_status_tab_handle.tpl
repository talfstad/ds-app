

<% if(deploy_status === "deployed") { %>
        
      <span class="open_sidemenu_r label bg-success">
        Deployed
      </span>
 
<% } else if(deploy_status === "deploying"){ %>
 
      <span class="open_sidemenu_r label bg-warning">
         <span style="margin-right: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Working...
      </span>
 
<% } else if(deploy_status === "not_deployed"){ %>
 
      <span class="open_sidemenu_r label bg-primary">
         Not Deployed
      </span>
  
<% } else if(deploy_status === "initializing"){ %>
 
      <span class="open_sidemenu_r label bg-alert">
         <span style="margin-right: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate">
         </span>
         Initializing
      </span>
  
<% } else if(deploy_status === "deleting"){ %>
 
      <span class="open_sidemenu_r label bg-warning">
         <span style="margin-right: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate">
         </span>
         Deleting
      </span>
  
<% } %>
