
<!-- <h5 class="title-divider text-muted mt20 mb10">Lander Name
            </h5>
<div class="field">
  <input id="lander-name-edit" name="name" class="form-control" type="text" value="<%= name %>">
  <span class="input-group-addon input-group-addon-default">
                <i title="Save Lander Name" class="fa fa-file-o"></i>
              </span>
</div> -->
<h5 class="title-divider text-muted mt20 mb0"><span>#</span> <span style="margin-left: 15px">Domain Name Servers</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
<div class="bs-component">
  <table class="optimizations-table table">
    
    <% _.each(nameservers, function(nameserver, idx) { %>

    <tr>
      <td><%= idx + 1 %></td>
      <td class="absorbing-column"><%= nameserver %></td>
    </tr>

    <% }) %>

  </table>
</div>
