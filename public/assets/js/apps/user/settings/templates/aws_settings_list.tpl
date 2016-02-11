<div class="admin-form">
  <div class="section row mb10">
    <label for="accessKeyId" class="field-label col-md-3 text-center">Access Key ID:</label>
    <div class="col-md-9">
      <label for="accessKeyId" class="field prepend-icon">
        <input type="text" name="accessKeyId" id="access-key-id" class="gui-input" value="<%= aws_access_key_id %>">
        <label for="accessKeyId" class="field-icon">
          <i class="fa fa-key"></i>
        </label>
      </label>
    </div>
  </div>
  <div class="section row mb10">
    <label for="secretAccessKey" class="field-label col-md-3 text-center">Secret Access Key:</label>
    <div class="col-md-9">
      <label for="secretAccessKey" class="field prepend-icon">
        <input type="text" name="secretAccessKey" id="secret-access-key" class="gui-input" value="<%= aws_secret_access_key %>">
        <label for="secretAccessKey" class="field-icon">
          <i class="fa fa-user-secret"></i>
        </label>
      </label>
    </div>
  </div>
</div>