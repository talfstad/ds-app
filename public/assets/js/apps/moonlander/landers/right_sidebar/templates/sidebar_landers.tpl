      <!-- Start: Sidebar Right Content -->
      <div class="sidebar-right-content nano-content p10">
        <div class="panel" id="p5">
          <div class="panel-heading">
            <span class="panel-title">Lander Edit &amp; Optimization</span>
            <span class="close-right-sidebar panel-controls"><a href="#" class="panel-control-loader"></a><a href="#" class="panel-control-remove"></a></span>
          </div>
          <div class="panel-menu">
            <div class="btn-group">
              <button type="button" style="width: 85px" class="btn btn-default btn-gradient dark">Duplicate</button>
              <button type="button" style="width: 85px" class="lander-edit btn btn-default btn-gradient dark">Edit</button>
              <button type="button" style="width: 85px" class="btn btn-default btn-gradient dark">Deploy</button>
            </div>
          </div>
          
          <div class="admin-form panel-body pn pb25" style="font-size: 13px">
            <h5 class="title-divider text-muted mt20 mb10">Lander Name
            </h5>
            <div class="bs-component">
              <input type="text" id="inputStandard" class="form-control" value="<%= name %>">
            </div>
            <h5 class="title-divider text-muted mt30 mb0"><span>#</span> <span style="margin-left: 25px">Deployment Optimizations</span>
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
            <div class="bs-component">
              <table class="table">               
                <tr>
                  <td>1</td>
                  <td>Gzip Compression</td>
                  <td>
                    <label class="switch switch-success switch-round block mn">
                      <input type="checkbox" name="gzip" id="optimization-gzip" value="angular">
                      <label for="optimization-gzip" data-on="ON" data-off="OFF"></label>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Optimize JS</td>
                  <td>
                    <label class="switch switch-success switch-round block mn">
                      <input type="checkbox" name="optimize-js" id="optimization-js" value="angular">
                      <label for="optimization-js" data-on="ON" data-off="OFF"></label>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Optimize CSS</td>
                  <td>
                    <label class="switch switch-success switch-round block mn">
                      <input type="checkbox" name="optimize-css" id="optimization-css" value="angular">
                      <label for="optimization-css" data-on="ON" data-off="OFF"></label>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Optimize Images</td>
                  <td>
                    <label class="switch switch-success switch-round block mn">
                      <input type="checkbox" name="optimize-images" id="optimization-images" value="angular">
                      <label for="optimization-images" data-on="ON" data-off="OFF"></label>
                    </label>
                  </td>
                </tr>
              </table>
            </div>

           
            <div class="title-divider">
              <h5 class="text-muted mt30 mb10">
                Active JS Snippets 
                <a style="float: right" href="#">
                  <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
                </a>
              </h5>
              <div class="bs-component ml15">
                <button type="button" style="font-size: 13px" class="mr10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
                  <span class="fa fa-plus pr5" ></span>Add Snippet
                </button>
              </div>
            </div>


            <div id="jssnippets-tree" class="snippets-container fancytree-radio">
              <ul id="treeData" style="display: none;" class="ui-fancytree-source ui-helper-hidden">
                <li id="5.7" class="fancytree-page expanded">safepage.html
                  <ul>
                    <li id="5.81" data-hey="true">
                      <span>
                        JS Cloaker
                        <a class="trash-link" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        <a class="edit-link" href="#"><i class="pull-right ml15 mt3 fa fa-pencil-square-o"></i></a>
                      </span></li>
                    <li id="5.83">
                      <span>
                        JS No-referrer
                        <a class="trash-link" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        <a class="edit-link" href="#"><i class="pull-right ml15 mt3 fa fa-pencil-square-o"></i></a>
                      </span>
                    </li>
                  </ul>
                </li>
                <li id="5.7" class="fancytree-page expanded">index1.html
                  <ul>
                    <li id="5.81" data-hey="true">
                      <span>
                        JS Cloaker
                        <a class="trash-link" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        <a class="edit-link" href="#"><i class="pull-right ml15 mt3 fa fa-pencil-square-o"></i></a>
                      </span></li>
                    <li id="5.83">
                      <span>
                        JS No-referrer
                        <a class="trash-link" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        <a class="edit-link" href="#"><i class="pull-right ml15 mt3 fa fa-pencil-square-o"></i></a>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="panel-footer">
            <button type="button" class="delete-lander btn btn-danger btn-gradient dark">Delete Lander</button>
          </div>
        </div>