<% if(deploy_status === "deleting") { %> 


<span class="open_sidemenu_r label bg-danger">
  <span style="margin-right: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
  Deleting 
</span>

<% } else { %>

<span class="open_sidemenu_r">
   <img style="width: 20px; opacity: 0.5" src="/assets/img/logos/landers_icon_black.png">
   <span style="font-size: 12px; line-height: 29px"><%= active_landers_count %> <% if(active_landers_count > 1 || active_landers_count == 0) { %>Landers <% } else { %>Lander <% } %></span>
</span>

<% } %>
