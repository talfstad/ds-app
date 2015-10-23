<% if(deploy_status === "deployed") { %>
        
    <a href="#domains-tab-id<%= id %>" data-toggle="tab">
      <span class="open_sidemenu_r label bg-success">
        Deployed
      </span></a>
 
<% } else if(deploy_status === "deploying"){ %>
 
    <a href="#domains-tab-id<%= id %>" data-toggle="tab">
      <span class="open_sidemenu_r label bg-warning">
         <span style="margin-right: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Deploying
      </span>
    </a>
 
<% } else if(deploy_status === "not_deployed"){ %>
 
    <a href="#domains-tab-id<%= id %>" data-toggle="tab">
      <span class="open_sidemenu_r label bg-warning">
         Not Deployed
      </span>
    </a>
  
<% } %>