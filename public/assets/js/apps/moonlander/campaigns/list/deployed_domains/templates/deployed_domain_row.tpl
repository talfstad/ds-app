  <td style="width: 20px">
    <%= viewIndex %>
  </td>
  <td>
    <div>
      <%= domain %>
        <div style="float: right; margin-right: 10px; font-size: 16px">

        <% if(deploy_status === "deployed") { %>

        <a class="remove-domain" data-domainId="df" data-domainName="fd" href="#">
          <span class="fa fa-trash-o"></span>
        </a>

       
        <% } else { %>
        
        <span style="font-size: 13px">
          <%= deploy_status_gui %>
        </span>

        <% } %>
          
        </div>
    </div>
  </td>