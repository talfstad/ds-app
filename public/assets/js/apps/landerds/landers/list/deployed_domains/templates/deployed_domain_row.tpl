<td><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; max-width: 305px; min-width: 145px">
      <span><%= domain %></span>
</td>

<td class="absorbing-column">  
<div class="domains-lander-links" style="margin-left: 0;">
      

      <% if(deploy_status === "deployed") { %>

      <div class="landers-select-container">

      <select style="width: 300px" class="ml15 lander-links-select form-control select2-single">
        
        <% _.each(urlEndpointsJSON, function(endpoint) { %>
        
        <option><%= endpoint.filename %></option>

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

            <span style="margin-left: 50px;">
              <span style="margin-right: 5px">2.0 sec</span>
              <a class="refresh" href="#">
                <span class="fa fa-refresh" style="padding-right: 1px; padding-left: 2px"></span>
              </a>
            </span>

          </div>

      <% } %>

      <div style="float: right; margin-right: 10px; font-size: 16px">

        <% if(deploy_status === "deployed") { %>
        
          
        <% if(hasActiveCampaigns) { %>

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