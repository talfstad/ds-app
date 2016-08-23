<div style="min-height: 400px; width: 100%; text-align: center" class="empty-landers">
  <div style="display: inline-block; margin-top: 0px">

      <% if(filterVal === "") { %> 
        <div style="text-align: left">
        <h3>
          Welcome to Landing Pages! To get started Rip, or Add a new lander!
        </h3>
      </div>
      <% } else { %>

      <div style="margin-top: 70px">
        <h2 style="display: inline" class="text-muted"><span class="fa fa-warning"></span> You Don't Have Any Landers With </h2><h1 style="display: inline" > <%= filterVal %> </h1><h2 style="display: inline" class="text-muted"> in the Name </h2>
      </div>

      <% } %>

  </div>
</div>
