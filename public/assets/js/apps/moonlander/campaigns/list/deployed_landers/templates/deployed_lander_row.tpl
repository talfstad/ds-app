<td><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; max-width: 305px; min-width: 145px">
      <span><%= name %></span>
</td>

<td class="absorbing-column">  
<div class="row campaigns-lander-links" style="margin-left: 0;">
      <% if(deploy_status === "deployed" && deployedDomains.length > 0) {  %>

      
          <div class="domains-select-container">

          <select style="width: 600px" class="ml15 domain-select form-control select2-single">
          
            <% _.each(deployed_domains_gui, function(domain) { %> 
            <optgroup label="<%= domain.domain %>">
           

              <% _.each(urlEndpoints, function(endpoint) { %>
            
              <option> <%= domain.domain %>/<%= endpoint.name %></option>

              <% }); %>

            </optgroup>
            <% }); %>   
            
          </select>
          </div>

          <div style="display: inline; position: relative; top: 4px">
            <a style="margin-left: 10px;" class="open-link" href="#">
              <span class="fa fa-eye"></span>
            </a>

            <a style="margin-left: 15px;" class="copy-clipboard" href="#">
              <span class="fa fa-clipboard"></span>
            </a>
          </div>
        
      <% } %>

     
      <div class="domain-action-buttons" style="position: relative; top: 2px">

        <% if(deploy_status === "deployed") { %>

        
        
        <a class="" href="#">
          <span class="fa fa-edit"></span>
        </a>

        <a class="remove-lander" href="#">
          <span class="fa fa-trash-o" style="padding-right: 1px; padding-left: 2px"></span>
        </a>

       
        <% } else { %>
        
        <span style="font-size: 13px; margin-right: 20px">
          <%= deploy_status_gui %>
        </span>

        <% } %>

      </div>
      </div>

</td>
