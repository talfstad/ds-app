

<% if(deploy_status === "deployed") { %>
        
      <span class="open_sidemenu_r label bg-success">
        Deployed
      </span>
 
<% } else if(deploy_status === "deploying"){ %>
 
      <span class="open_sidemenu_r label bg-warning">
         <span style="margin-right: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Deploying
      </span>
 
<% } else if(deploy_status === "not_deployed"){ %>
 
      <span class="open_sidemenu_r label bg-warning">
         Not Deployed
      </span>
  
<% } %>
