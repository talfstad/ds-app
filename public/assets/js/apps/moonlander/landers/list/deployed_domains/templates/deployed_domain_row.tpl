  <td style="width: 20px">
    <%= viewIndex %>
  </td>
  <td>
    <div>
      <%= domain %>
        <div style="float: right; margin-right: 10px; font-size: 16px">

        <% if(deploy_status === "deployed") { %>

        <% if(hasActiveCampaigns) { %>

        <a class="campaign-tab-link" href="#">
            <span class="icon-campaigns_icon">
              
                </span>
          </a>

        <% } else { %>

        <a class="remove-domain" href="#">
          <span class="fa fa-trash-o"></span>
        </a>

        <% } %>
       
        <% } else { %>
        
        <span style="font-size: 13px">
          <%= deploy_status_gui %>
        </span>

        <% } %>
          
        </div>
    </div>
  </td>