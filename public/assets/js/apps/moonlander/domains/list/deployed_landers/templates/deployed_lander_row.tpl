<td><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; min-width: 145px">
      <%= deploy_status_gui %> 
      <span><%= name %></span>
</td>

<td class="absorbing-column">  
      

      <% if(deploy_status === "deployed") { %>

      <select class="domain-endpoint-select form-control">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option> <%= endpoint.name %></option>

        <% }); %>
      
      </select>      

      <div class="domain-action-buttons">

     

        <a class="" href="#">
          <span class="fa fa-eye"></span>
        </a>
        
        <a class="" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <% if(attached_campaigns_gui.length > 0) { %>

          <% _.each(attached_campaigns_gui, function(campaignName, i){ %>
          
          <a class="campaign-tab-link" href="#">
            <span><%= campaignName %></span></a><% if (i !== attached_campaigns_gui.length-1){ %>,<% } %>
          <% }); %>


        <% } else { %>
        
        <a class="undeploy" href="#">
          <span class="fa fa-trash-o"></span>
        </a>

      

      <% } %>
        

      </div>

    <% } %>
</td>
