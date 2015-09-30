<!-- pagination buttons -->
<% if(num_pages > 1) { %>

  <% if(1 == current_page) { %>

  <button type="button" class="disabled first-page mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    <span class="fa fa-angle-double-left pr5"></span> First
  </button>
  <button type="button" class="disabled previous-page mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    <span class="fa fa-angle-left pr5"></span> Previous
  </button>

  <% } else { %>

  <button type="button" class="first-page mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    <span class="fa fa-angle-double-left pr5"></span> First
  </button>
  <button type="button" class="previous-page mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    <span class="fa fa-angle-left pr5"></span> Previous
  </button>

  <% } %>

  <div id="pages-list" style="display: inline">

  <% for(var i=1 ; i<= num_pages ; i++) { %>

    <% if(i == current_page) { %> 

    <a href="#" class="current-page"><%= i %></a>

    <% } else { %>

    <a class="goto-page" data-page="<%= i %>" href="#"><%= i %></a>

    <% } %>

  <% } %>
  </div>

  <% if(current_page == num_pages) { %>

  <button type="button" class="disabled next-page ml10 mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    Next <span class="fa fa-angle-right pl5"></span>
  </button>
  <button type="button" class="disabled last-page mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    Last <span class="fa fa-angle-double-right pl5"></span>
  </button>
  
  <% } else { %>
  
  <button type="button" class="next-page ml10 mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    Next <span class="fa fa-angle-right pl5"></span>
  </button>
  <button type="button" class="last-page mr10 pl10 w95 pt5 pb5 btn btn-default btn-gradient dark">
    Last <span class="fa fa-angle-double-right pl5"></span>
  </button>
  
  <% } %>

<% } %>