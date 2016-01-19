<td><%= viewIndex %></td>
<td class="table-lander-name" style="white-space: nowrap; min-width: 145px">
      <span>asdfasdfasdfasdf1122TREVY dup</span>
</td>

<td class="absorbing-column">  
      <a class="domain-link" target="_blank"><%= domain %>/</a>
      
      <select class="domain-endpoint-select form-control">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option> <%= endpoint.name %></option>

        <% }); %>
      
      </select>
      

      <div style="float: right; margin-right: 10px">

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
</td>
