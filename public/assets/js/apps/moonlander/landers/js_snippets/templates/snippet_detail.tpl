<header class="snippets-header">
  <div class="snippet-name-container">
    <div class="snippet-name">
      <h4><%= name %></h4>
    </div>
    <div style="float: left; margin-top: 4px; font-size: 12px">
      <!--  <a href="">
                See Description
                </a> -->
      <div class="btn-group">
        <% if(!editing) { %>
          <button type="button" style="width: 80px" class="edit-snippet-button ml10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
            <span class="fa fa-file-code-o pr5"></span>Edit
          </button>
          <% } else { %>
            <button type="button" class="show-description-button ml10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
              <span class="fa fa-eye pr5"></span>Description
            </button>
            <% } %>
              <button type="button" style="width: 80px" class="<% if(!changed) { %>disabled <% } %> save-snippet-code-button pl10 pt5 pb5 btn btn-default btn-gradient dark">
                <span class="fa fa-save pr5"></span>Save
              </button>
              <button type="button" style="width: 80px" class="delete-snippet pl10 pt5 mr10 pb5 btn btn-default btn-gradient dark">
                <span class="fa fa-trash-o pr5"></span>Delete
              </button>
      </div>
    </div>
  </div>
  <div class="control-buttons-container">
    <div class="btn-group">
      <div class="add-snippet-to-page-container">
        <select class="snippets-endpoint-select select2-single form-control">
          <% _.each(availableUrlEndpoints, function(endpoint) { %>
            <option value="<%= endpoint.id %>">
              <%= endpoint.name %>
            </option>
            <% }) %>
        </select>
        <button type="button" style="border-left:none" class="<% if(availableUrlEndpoints.length <= 0) { %>disabled <% } %>add-to-lander mr10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
          <span class="fa fa-plus pr5"></span>Add to Page
        </button>
      </div>
      <!-- <div class="btn-group">
        <button type="button" style="width: 80px" class="<% if(!changed) { %>disabled <% } %> save-snippet-code-button pl10 pt5 pb5 btn btn-default btn-gradient dark">
          <span class="fa fa-save pr5"></span>Save
        </button>
        <button type="button" style="width: 80px" class="pl10 pt5 mr10 pb5 btn btn-danger btn-gradient dark">
          <span class="fa fa-save pr5"></span>Delete
        </button>
      </div> -->
    </div>
  </div>
</header>
<div class="code-pane resize-edit clearfix">
  <div class="js-snippet-alert alert alert-warning">
    <%= snippetAlertMsg %>
  </div>
  <div class="js-snippet-description">
    <div style="margin-left: 45px; margin-top: 20px;">
      <% if(!showEditInfo) { %>
        <div class="snippet-info-content">
          <h3>Description:</h3>
          <div>
            <div style="float: left; width: 50%">
              <p>
                <%= description %>
              </p>
              <div style="float: left; width: 50%">
                <button type="button" class="mt10 change-snippet-info-button btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Change Name/Description</button>
              </div>
            </div>
          </div>
        </div>
        <% } else { %>
          <div class="snippet-info-content" style="width: 90%">
            <h3>Edit Snippet Information:</h3>
            <form class="form-vertical" role="form">
              <div class="form-group">
                <label for="inputStandard" class="col-lg-12 control-label">Name:</label>
                <div class="col-lg-12">
                  <div class="bs-component">
                    <input type="text" name="name" id="inputStandard" class="form-control" value="<%= name %>">
                    <div id="source-button" class="btn btn-primary btn-xs" style="display: none;">&lt; &gt;</div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label style="margin-top: 15px" class="col-lg-12 control-label" for="textArea2">Description:</label>
                <div class="col-lg-12">
                  <div class="bs-component">
                    <textarea style="resize: none" name="description" class="form-control" id="textArea2" rows="4"><%= description %></textarea>
                  </div>
                </div>
              </div>
            </form>
            <div class="btn-group ml10">
              <button type="button" style="width: 85px" class="mt10 save-edit-info-button btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Save</button>
              <button type="button" style="width: 85px" class="mt10 cancel-edit-info-button btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Cancel</button>
            </div>
          </div>
          <% } %>
    </div>
  </div>
  <form>
    <textarea style="display: none" class="code-area"></textarea>
  </form>
</div>
