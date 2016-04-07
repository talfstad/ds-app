<tr class="campaign-name-row dark" style="border: none; font-size: 14px">
  <td style="width: 20px">
    <%= viewIndex %>
  </td>
  <td>
    <div>
      <%= name %>
        <div style="float: right; margin-right: 10px; font-size: 16px">
        <% if(deploy_status === "deployed"){ %>
          <a class="undeploy" data-domainId="df" data-domainName="fd" href="#">
            <span class="remove-campaign fa fa-trash-o"></span>
          </a>
        <% } else { %>
        
          <span style="font-size: 13px">
            <%= deploy_status_gui %>
          </span>

        <% } %>
        
        </div>
    </div>
  </td>
</tr>

<% _.each(deployedDomains, function(domain) { %>
  <tr class="lander-on-campaign-row primary">
    <td></td>
    <td>
      <div style="margin-left: 100px"> <%= domain.domain %> </div>
    </td>
  </tr>
  <% }) %>
