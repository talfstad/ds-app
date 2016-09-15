<div class="topbar-left">
  <ol class="breadcrumb">
    <li class="crumb-active" style="font-size: 20px; color: #222">
      <span style="position: relative; top: 1px" class="icon-groups_icon"></span>
      <span>Groups</span>
    </li>
    <li class="crumb-trail">Showing <%= showing_low %>-<%= showing_high %> of <%= showing_total %></li>
  </ol>

  <div class="right-stats"> 

<% 
      var total_domains = "Groups"
      if(total > 1 || total < 1) {
        total_domains = "Groups"
      }

      var deletingGroupsText = "Groups"
      if(total_deleting > 1 || total_deleting < 1){
        deletingGroupsText = "Groups"
      }

      var deployingGroupsText = "Groups"
      if(total_deploying > 1 || total_deploying < 1) {
        deployingGroupsText = "Groups"
      }

  if(total_deleting > 0) { %>
      
      <div>
        <span class="badge-alert badge"><%= total_deleting %></span> <%= deletingGroupsText %> Deleting
      </div>

  <% }

    if(total_deploying > 0) { %>
      
      <div>
        <span class="badge-alert badge"><%= total_deploying %></span> <%= deployingGroupsText %> Working
      </div>

  <% } %>


    <div>
      <span class="badge-light badge"><%= total %></span> Total <%= total_domains %>
    </div>
  </div>
</div>
