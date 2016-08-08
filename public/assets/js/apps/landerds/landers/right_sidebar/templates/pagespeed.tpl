<% if(currentPreviewEndpointId) { %>
<h5 class="title-divider mt10 mb0">
              Google PageSpeed
            </h5>
<div style="width: 250px; height: 100px; margin: 0 auto">
  <div id="original-lander-pagespeed" style="width: 125px; height: 100px; float: left"></div>
  <div id="optimized-lander-pagespeed" style="width: 125px; height: 100px; float: left"></div>
</div>

<% if(optimization_errors_gui.cssError || optimization_errors_gui.jsError) { %>
<h5 class="title-divider text-muted mt20 mb10">Optimization Errors</h5>
	<ul class="pl15">
	<% if(optimization_errors_gui.cssError) { %>
		<li class="text-danger ml5">Partially Optimized CSS</li>
		<p class="mt5">This error occurs when there is invliad CSS on your lander.</p>
	<% } %>
	<% if(optimization_errors_gui.jsError) { %>
		<li class="text-danger ml5">Partially Optimized JS</li>
		<p class="mt5">This error occurs when there is invalid JS on your lander.</p>
	<% } %>
	</ul>
<% } %>


<% }  else { %>

<div style="width: 250px; height: 100px; margin: 25px 30px 0">
<p>No Current Endpoint Selected</p>
</div>

<% } %>