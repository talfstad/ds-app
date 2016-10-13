<header class="edit-header">
  <div class="snippet-name-container">
    <div class="snippet-name">
      <h4>Create a new Javascript Snippet</h4>
    </div>
  </div>
</header>
<div class="code-pane resize-edit clearfix">
  <div class="code-pane resize-edit clearfix">
    <!-- <div class="alert alert-micro alert-border-left alert-default new-lander-info-alert" style="margin-bottom: 0">
      <i class="fa fa-info pr10"></i>To create a new snippet just enter a name and description. Once you've saved it, you can start editing the code.
    </div> -->
    <div class="create-snippet-alert js-snippet-alert alert alert-warning">
      <%= snippetAlertMsg %>
    </div>
    <div class="js-snippet-description">
      <div class="clearfix" style="margin-left: 45px;">
        <div style="margin-top: 25px">
          <p>
            <i class="fa fa-info pr10"></i> To create a new snippet just enter a name and description. Once you've saved it, you can start editing the code.
          </p>
        </div>
        <div class="admin-form snippet-info-content" style="width: 90%">
          <form class="form-vertical" role="form">
            <div class="form-group">
              <label for="name" class="mb10 col-lg-12 control-label">Name:</label>
              <div class="col-lg-12">
                <div class="bs-component">
                  <input type="text" name="name" id="name" class="new-snippet-name form-control" value="">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label style="margin-top: 15px" class="mb10 col-lg-12 control-label" for="textArea2">Description:</label>
              <div class="col-lg-12">
                <div class="bs-component">
                  <textarea style="resize: none" name="description" class="form-control" id="textArea2" rows="4"></textarea>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="mt15 ml10 option option-primary">
                <input type="checkbox" name="loadBeforeDom">
                <span class="checkbox"></span>Load Before DOM</label>
            </div>
          </form>
          <div class="btn-group ml10 mt25">
            <button type="button" style="width: 85px" class="save-new-snippet-button btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Save</button>
            <button type="button" style="width: 85px" class="cancel-new-snippet-button btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <form>
    </form>
  </div>
