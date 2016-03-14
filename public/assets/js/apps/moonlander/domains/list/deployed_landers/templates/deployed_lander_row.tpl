<td><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; max-width: 305px; min-width: 145px">
      <span><%= name %></span>
</td>

<td class="absorbing-column">  
<div class="row domains-lander-links" style="margin-left: 0;">
      

      <% if(deploy_status === "deployed") { %>

      <div class="landers-select-container">

      <select style="width: 600px" class="ml15 lander-links-select form-control select2-single">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option>http://<%= domain %>/<%= endpoint.name %></option>

        <% }); %>
      
      </select>

      </div>
      <div style="display: inline; position: relative; top: 3px">
            <a style="margin-left: 10px;" class="open-link" href="#">
              <span class="fa fa-eye"></span>
            </a>

            <a style="margin-left: 15px;" class="copy-clipboard" href="#">
              <span class="fa fa-clipboard"></span>
            </a>
          </div>

      <% } %>

      <div class="domain-action-buttons" style="position: relative; top: 3px">

        <% if(deploy_status === "deployed") { %>

        
        
        <a class="" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <% if(attached_campaigns_gui.length > 0) { %>

          <a class="campaign-tab-link" href="#">
            <span class="icon-campaigns_icon">
                
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
</div>
</td>
