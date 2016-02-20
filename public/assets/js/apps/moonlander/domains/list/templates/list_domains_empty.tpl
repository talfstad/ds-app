<div style="height: 400px; width: 100%; text-align: center" class="empty-landers">

<div style="display: inline-block; margin-top: 75px">
	<% if(filterVal === "") { %> 

	<h1 class="text-muted">Add a domain!</h1>

	<% } else { %>

	<h2 style="display: inline" class="text-muted"><span class="fa fa-warning"></span> You Don't Have Any Domains With </h2><h1 style="display: inline" > <%= filterVal %> </h1><h2 style="display: inline" class="text-muted"> in the Name </h2>

	<% } %>
	
</div>

</div>