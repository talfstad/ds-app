<h5 class="title-divider text-muted mt20 mb10"><span>Lander Links</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
<div class="btn-group">
  <div class="select-with-button" style="width: 190px">
    <select class="test-link-endpoints-select select2-single form-control">
      <% _.each(urlEndpointsJSON, function(endpoint){ %>
        <option value="">
          <%= endpoint.name %>
        </option>
        <% }) %>
    </select>
  </div>
  <button type="button" style="border-left:none; height: 39px" class="open-test-link pl10 pt5 pb5 btn btn-default btn-gradient dark">
    <span class="text-info fa fa-link pr5"></span>Open
  </button>
</div>
<h5 class="title-divider text-muted mt20 mb10">Lander Name
            </h5>
<div class="input-group">
  <input id="lander-name-edit" name="name" class="form-control" type="text" value="<%= name %>">
  <span class="input-group-addon input-group-addon-default">
                <i title="Save Lander Name" class="fa fa-file-o"></i>
              </span>
</div>
<h5 class="title-divider text-muted mt30 mb0"><span>#</span> <span style="margin-left: 20px">Deployment Optimizations</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
<div class="bs-component">
  <table class="optimizations-table table">
    <tr>
      <td>1</td>
      <td>Gzip Compression</td>
      <td>
        <label class="switch switch-success switch-round block mn">
          <% if(optimize_gzip) { %>
            <input type="checkbox" checked name="gzip" id="optimization-gzip" value="angular">
            <% } else { %>
              <input type="checkbox" name="gzip" id="optimization-gzip" value="angular">
              <% } %>
                <label for="optimization-gzip" data-on="ON" data-off="OFF"></label>
        </label>
      </td>
    </tr>
    <tr>
      <td>2</td>
      <td>Optimize JS</td>
      <td>
        <label class="switch switch-success switch-round block mn">
          <% if(optimize_js) { %>
            <input type="checkbox" checked name="optimize-js" id="optimization-js" value="angular">
            <% } else { %>
              <input type="checkbox" name="optimize-js" id="optimization-js" value="angular">
              <% } %>
                <label for="optimization-js" data-on="ON" data-off="OFF"></label>
        </label>
      </td>
    </tr>
    <tr>
      <td>3</td>
      <td>Optimize CSS</td>
      <td>
        <label class="switch switch-success switch-round block mn">
          <% if(optimize_css) { %>
            <input type="checkbox" checked name="optimize-css" id="optimization-css" value="angular">
            <% } else { %>
              <input type="checkbox" name="optimize-css" id="optimization-css" value="angular">
              <% } %>
                <label for="optimization-css" data-on="ON" data-off="OFF"></label>
        </label>
      </td>
    </tr>
    <tr>
      <td>4</td>
      <td>Optimize Images</td>
      <td>
        <label class="switch switch-success switch-round block mn">
          <% if(optimize_images) { %>
            <input type="checkbox" checked name="optimize-images" id="optimization-images" value="angular">
            <% } else { %>
              <input type="checkbox" name="optimize-images" id="optimization-images" value="angular">
              <% } %>
                <label for="optimization-images" data-on="ON" data-off="OFF"></label>
        </label>
      </td>
    </tr>
  </table>
</div>
