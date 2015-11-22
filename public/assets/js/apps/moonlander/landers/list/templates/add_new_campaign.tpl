      
<% if(deploy_status !== "initializing") { %>

<button type="button" class="add-to-campaign btn btn-default btn-gradient dark"><span class="fa fa-plus pr5"></span>Add to New Campaign</button>

<% } else { %>

<button type="button" class="disabled add-to-campaign btn btn-default btn-gradient dark"><span class="fa fa-plus pr5"></span>Add to New Campaign</button>

<% } %>
