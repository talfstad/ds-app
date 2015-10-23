<td style="width: 20px"><%= viewIndex %></td>
<td>
  <a class="domain-link" target="_blank" href="http://www.hardbodiesandboners.org/campaign2/extreme"><%= domain %>/</a> 

      <select class="domain-endpoint-select form-control">
        
        <% _.each(urlEndpoints, function(endpoint) { %>
        
        <option> <%= endpoint.name %></option>

        <% }); %>
      
      </select>
      <div style="float: right; margin-right: 10px">
        <a class="undeploy" data-domainId="df" data-domainName="fd" href="#">
          <span class="fa fa-trash-o"></span>
        </a>
      </div>
</td>