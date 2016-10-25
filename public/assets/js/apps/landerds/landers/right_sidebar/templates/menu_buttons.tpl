<button type="button" style="width: 85px;" class="disabled edit-button btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Edit</button>

<button type="button" style="width: 85px; padding: 9px 3px" class="<% if(saving_lander) { %>disabled<% } %> duplicate-lander-button btn btn-default btn-gradient dark"><span class="fa fa-copy pr5"></span>Clone</button>

<% if(showSaveButtonGui) { %>

<button type="button" style="width: 85px" class="save-button <% if(!saveDeployEnabledGui) { %>disabled<% } %> btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Save</button>

<% } else { %>

<button type="button" style="width: 85px" class="redeploy-all-locations <% if(!saveDeployEnabledGui) { %>disabled<% } %> btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Deploy</button>
<% } %>