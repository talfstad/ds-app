<td><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; min-width: 145px">
      <span><%= name %></span>
</td>

<td class="absorbing-column">  
      

      <% if(deploy_status === "deployed") { %>

      <select class="domain-endpoint-select form-control">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option> <%= endpoint.name %></option>

        <% }); %>
      
      </select>      

      <% } %>

      <div class="domain-action-buttons">

        <% if(deploy_status === "deployed") { %>

        <a class="" href="#">
          <span class="fa fa-eye"></span>
        </a>
        
        <a class="" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <% if(attached_campaigns_gui.length > 0) { %>

          <a class="campaign-tab-link" href="#">
            <span class="icon-campaigns_icon2">
                
                </span>
          </a>
          

          <% } else { %>
        
          <a class="undeploy" href="#">
            <span class="fa fa-trash-o" style="padding-right: 1px; padding-left: 2px"></span>
          </a>

          <% } %>

        <% } else { %>
        
        <span style="font-size: 13px">
          <%= deploy_status_gui %>
        </span>

        <% } %>

      </div>

</td>
