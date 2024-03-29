<td class="view-index"><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; max-width: 305px; min-width: 145px">
      <span><%= name %></span>
</td>

<td class="absorbing-column">  
<div class="row groups-lander-links" style="margin-left: 0;">
    
      <div class="domain-action-buttons mr10">

        <% if(deploy_status === "deployed") { %>        
        
        <div style="float: right; font-size: 16px">
          <a class="goto-edit-lander" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <a class="undeploy" href="#">
          <span class="fa fa-trash-o" style="padding-right: 1px; padding-left: 2px"></span>
        </a>

        </div>

       
        <% } else { %>
        
        <span style="font-size: 13px; margin-right: 10px">
          <%= deploy_status_gui %>
        </span>

        <a class="goto-edit-lander" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <% } %>

      </div>
      </div>

</td>
