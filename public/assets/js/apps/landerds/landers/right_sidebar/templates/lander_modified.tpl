<% if(saving_lander) { %>

  <span style="position: absolute; top: 12px" class="glyphicon mr5 glyphicon-refresh glyphicon-refresh-animate"></span>
  <span style="padding-left: 20px; font-weight: 600">Saving Lander</span>

<% } else { %>
	<% if(showSaveButtonGui) { %> 
	  <span style="font-weight: 600">Lander Outdated</span>. Save is Required.
	<% } else { %>
	  <span style="font-weight: 600">Lander Outdated</span>. Deploy is Required.
	<% } %>

<% } %>