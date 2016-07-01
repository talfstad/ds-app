<button type="button" title="The Lander Edit feature isn't quite ready for use!" style="width: 85px; pointer-events:all" class="tool-tip lander-edit btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Edit</button>

<button type="button" style="width: 85px; padding: 9px 3px" class="duplicate-lander-button btn btn-default btn-gradient dark"><span class="fa fa-copy pr5"></span>Copy</button>
<% if(deployedDomains.length <= 0) { %>
<button type="button" style="width: 85px" class="save-button <% if(!modified) { %>disabled<% } %> btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Save</button>
<% } else { %>
<button type="button" style="width: 85px" class="redeploy-all-locations <% if(!modified) { %>disabled<% } %> btn btn-default btn-gradient dark"><span class="fa fa-upload pr5"></span>Deploy</button>
<% } %>