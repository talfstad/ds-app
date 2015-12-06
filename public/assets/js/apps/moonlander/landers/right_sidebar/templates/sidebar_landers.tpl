      <!-- Start: Sidebar Right Content -->
      <div class="sidebar-right-content nano-content p10">
        <div class="panel" id="p5">
          <div class="panel-heading">
            <span class="panel-title">Lander Edit &amp; Optimization</span>
            <span class="close-right-sidebar panel-controls"><a href="#" class="panel-control-loader"></a><a href="#" class="panel-control-remove"></a></span>
          </div>
          <div class="panel-menu">
            <div class="btn-group">
              <button type="button" style="width: 95px" class="duplicate-lander-button btn btn-default btn-gradient dark"><span class="fa fa-copy pr5"></span>Duplicate</button>
              <button type="button" style="width: 73px" class="lander-edit btn btn-default btn-gradient dark"><span class="fa fa-edit pr5"></span>Edit</button>
              <button type="button" style="width: 87px" class="save disabled btn btn-default btn-gradient dark"><span class="fa fa-save pr5"></span>Update</button>
            </div>
          </div>
          
          <div class="admin-form panel-body pn pb25" style="font-size: 13px">
            <h5 class="title-divider text-muted mt20 mb10">Lander Name
            </h5>
            <div class="input-group">
              <input id="lander-name-edit" name="name" class="form-control" type="text" value="<%= name %>">
              <span class="input-group-addon">
              <a class="disabled" href="#">  <i title="Save Lander Name" class="fa fa-save"></i></a>
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

            <h5 class="title-divider text-muted mt30 mb0">
              Active JS Snippets 
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
              <a style="float: right" title="Add a new snippet" href="#">
                <i style="font-size: 18px !important" class="fa fa-plus text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
        
            <div id="jssnippets-tree-container" class="snippets-container fancytree-radio">
              <div id="jssnippets-tree" class="fancytree-radio ui-fancytree-source">
              
              </div>
            </div>

            

          </div>
          <div class="panel-footer">
            <button type="button" class="delete-lander-button btn btn-danger btn-gradient dark"><span class="fa fa-trash pr5"></span>Delete Lander</button>
          </div>
        </div>