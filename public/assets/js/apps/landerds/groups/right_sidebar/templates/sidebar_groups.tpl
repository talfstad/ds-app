<!-- Start: Sidebar Right Content -->
<div class="sidebar-right-content nano-content p10">
  <div class="panel" style="margin-bottom: 0">
    <div class="panel-heading" style="border-bottom: none;">
      <span class="panel-title">Groups Information</span>
      <span class="close-right-sidebar panel-controls"><a href="#" class="panel-control-loader"></a><a href="#" class="panel-control-remove"></a></span>
    </div>
  </div>
  <div class="js-snippet-alert alert alert-danger group-name-alert" style="display: none;">  
      <span style="font-weight: 600">Group Name Can't be Empty</span>.
  </div>
  <div class="admin-form panel-body pn pb25" style="font-size: 13px">
    <div class="name-and-optimizations-region">
      <h5 class="title-divider mt20 mb10">Group Name
  <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
      <input name="name" style="width: 193px; border-radius: 4px 0 0 4px; float: left;" class="form-control group-name-edit" type="text" value="<%= name %>">
      <button type="button" style="border-left: none; line-height: 1.4; border-radius: 0 4px 4px 0;" class="btn disabled btn-default btn-gradient dark update-group-name-button"><span class="fa fa-save pr5"></span>Save</button>
    </div>
  </div>
  <div class="panel-footer">
    <button type="button" class="remove-group-button btn btn-danger btn-gradient dark"><span class="fa fa-trash pr5"></span>Delete Groups</button>
  </div>
</div>
