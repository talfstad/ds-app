  <td class="view-index"><%= viewIndex %></td>
  <td class="table-lander-name" style="white-space: nowrap; max-width: 305px; min-width: 145px">
      <span><%= domain %></span>
  </td>
  <td class="absorbing-column">  
    <div class="row campaigns-lander-links" style="margin-left: 0;">
    
      <div class="domain-action-buttons">

        <% if(deploy_status === "deployed") { %>        
        
        <div style="float: right; margin-right: 10px; font-size: 16px">
          <a class="goto-edit-domain" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <a class="undeploy-domain" href="#">
          <span class="fa fa-trash-o"></span>
        </a>

        </div>
       
        <% } else { %>
        
        <span style="font-size: 13px; margin-right: 20px">
          <%= deploy_status_gui %>
        </span>

        <% } %>

      </div>
      </div>

  </td>