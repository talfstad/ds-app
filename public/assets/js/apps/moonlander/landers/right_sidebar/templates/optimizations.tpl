<h5 class="title-divider mt20 mb0"><span style="">Deployment Options</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
  <table class="optimizations-table table">
    <tr>
      <td>Fully Optimize Lander</td>
      <td>
        <label class="pull-right switch switch-success switch-round block mn">
          <% if(optimize_gzip) { %>
            <input type="checkbox" checked name="optimize_gzip" id="optimization-gzip" value="angular">
            <% } else { %>
              <input type="checkbox" name="optimize_gzip" id="optimization-gzip" value="angular">
              <% } %>
                <label for="optimization-gzip" data-on="YES" data-off="NO"></label>
        </label>
      </td>
    </tr>
    <tr>
      <td>Deploy to Domain Root</td>
      <td>
        <label class="pull-right switch switch-success switch-round block mn">
          <% if(optimize_js) { %>
            <input type="checkbox" checked name="optimize_js" id="optimization-js" value="angular">
            <% } else { %>
              <input type="checkbox" name="optimize_js" id="optimization-js" value="angular">
              <% } %>
                <label for="optimization-js" data-on="YES" data-off="NO"></label>
        </label>
      </td>
    </tr>
  </table>

  <h5 class="title-divider mt20 mb10">Deployment Folder Name
  <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
  <div>
    <input id="lander-name-edit" name="name" style="width: 193px; border-radius: 4px 0 0 4px; float: left;" class="form-control" type="text" value="<%= name %>">
    <button type="button" style="border-left: none; line-height: 1.4; border-radius: 0 4px 4px 0;" class="btn disabled btn-default btn-gradient dark"><span class="fa fa-save pr5"></span>Save</button>
  </div>


