

  <% if(deploy_status !== "initializing") { %>
  
  <button type="button" class="deploy-to-domain btn btn-default btn-gradient dark"><span class="fa fa-cloud-upload pr5"></span>Deploy to New Domain</button>
  
  <% } else { %>

  <button type="button" class="disabled deploy-to-domain btn btn-default btn-gradient dark"><span class="fa fa-cloud-upload pr5"></span>Deploy to New Domain</button>

  <% } %>
