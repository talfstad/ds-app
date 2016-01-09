<td style="width: 20px"><%= viewIndex %></td>
<td>
  <%= deploy_status_gui %> 

      <% if(deploy_status === "deployed") { %>
      
      <a class="domain-link" target="_blank"><%= domain %>/</a>
      
      <select class="domain-endpoint-select form-control">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option> <%= endpoint.name %></option>

        <% }); %>
      
      </select>
      
      <% } else { %>

      <a class="domain-link" target="_blank"><%= domain %></a> 

      <% } %>

      <div style="float: right; margin-right: 10px">

        <% if(attached_campaigns_gui.length > 0 && deploy_status === "deployed") { %>

          <% _.each(attached_campaigns_gui, function(campaignName, i){ %>
          
          <a class="campaign-tab-link" href="#">
            <span><%= campaignName %></span></a><% if (i !== attached_campaigns_gui.length-1){ %>,<% } %>
          <% }); %>


        <% } else if(deploy_status === "deployed") { %>
        
        <a class="undeploy" href="#">
          <span class="fa fa-trash-o"></span>
        </a>

        <% } %>
      </div>
</td>