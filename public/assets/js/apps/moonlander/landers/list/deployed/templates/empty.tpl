
<% if(deploy_status !== "initializing") { %>

<td style="width: 120px">Lander Preview: </td>
<td>
  <a class="domain-link" target="_blank" href="http://www.landerpreviewlink.org/extreme">http://www.landerpreviewlink.com/</a> 

      <select class="domain-endpoint-select form-control">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option> <%= endpoint.name %></option>

        <% }); %>
      
      </select>
</td>

<% } else { %>

<td style="">This lander is currently initializing. Please wait until initialization is finished to deploy.</td>
<td>

</td>


<% } %>