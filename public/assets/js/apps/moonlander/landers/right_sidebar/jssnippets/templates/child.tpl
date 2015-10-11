
  <%= page %>
  
  <ul>

    <% _.each(snippets, function(snippet) { %> 
  
    <li>
      <span>
        <%= snippet.name %>
        <a class="trash-link" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
        <a class="edit-link" href="#"><i class="pull-right ml15 mt3 fa fa-pencil-square-o"></i></a>
      </span>
    </li>

    <% }); %>

  </ul>