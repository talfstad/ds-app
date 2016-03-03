<tr class="dark" style="font-size: 14px">
  <td style="width: 20px">
    <%= viewIndex %>
  </td>
  <td>
    <div>
      <%= name %>
        <div style="float: right; margin-right: 10px; font-size: 16px">
          <a class="undeploy" data-domainId="df" data-domainName="fd" href="#">
            <span class="remove-campaign fa fa-trash-o"></span>
          </a>
        </div>
    </div>
  </td>
</tr>

<% _.each(currentLanders, function(lander) { %>
  <tr class="lander-on-campaign-row">
    <td></td>
    <td>
      <div style="margin-left: 100px"> <%= lander.name %> </div>
    </td>
  </tr>
  <% }) %>
