<button type="button" style="width: 85px; pointer-events:all" class="lander-edit btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Edit</button>

<button type="button" style="width: 85px; padding: 9px 3px" class="duplicate-lander-button btn btn-default btn-gradient dark"><span class="fa fa-copy pr5"></span>Copy</button>
<% if(deployedDomains.length <= 0) { %>
<button type="button" style="width: 85px" class="save-button <% if((!modified || deploymentFolderInvalid)) { %>disabled<% } %> btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Save</button>
<% } else { %>
<button type="button" style="width: 85px" class="redeploy-all-locations <% if((!modified || deploymentFolderInvalid)) { %>disabled<% } %> btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Deploy</button>
<% } %>