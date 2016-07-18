<div class="select-with-button" style="width: 163px">
  <select class="preview-link-endpoints-select select2-single form-control">
    <% _.each(urlEndpointsJSON, function(endpoint){ %>
      <option value="<%= endpoint.id %>">
        <%= endpoint.filename %>
      </option>
      <% }) %>
  </select>
</div>
<button type="button" style="width: 90px; border-left:none; height: 39px; border-radius: 0 4px 4px 0" class="open-preview-link pl10 pt5 pb5 btn btn-default btn-gradient dark">
  <span style="font-size: 14px" class="text-info fa fa-eye pr5"></span>Preview
</button>
