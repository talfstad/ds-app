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
              <button type="button" style="width: 85px" class="btn btn-default btn-gradient dark">Edit</button>
              <button type="button" style="width: 85px" class="btn btn-default btn-gradient disabled dark">Save</button>
            </div>
          </div>
          <div class="panel-body pn pb25">
            <h5 class="title-divider text-muted mt20 mb10">Name
             <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
            <div class="bs-component">
              <input type="text" id="inputStandard" class="form-control" value="<%= name %>">
            </div>
            <h5 class="title-divider text-muted mt30 mb10">Deployment Optimizations 
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
            <div class="bs-component">
              <div class="checkbox-custom checkbox-success mb5">
                <input type="checkbox" <% if(optimizations.gzip){ %> checked <% } %> id="checkboxDefault3">
                <label title="" for="checkboxDefault3">Gzip Lander</label>
              </div>
            </div>

            <div class="bs-component">
              <div class="checkbox-custom checkbox-success mb5">
                <input type="checkbox" <% if(optimizations.compressJs){ %> checked <% } %> id="checkboxDefault12">
                <label for="checkboxDefault12">Compress all javascript</label>
              </div>
            </div>
            <div class="bs-component">
              <div class="checkbox-custom checkbox-success mb5">
                <input type="checkbox" <% if(optimizations.singleFileJs){ %> checked <% } %> id="checkboxDefault4">
                <label for="checkboxDefault4">Combine all JS into single file</label>
              </div>
            </div>
            <div class="bs-component">
              <div class="checkbox-custom checkbox-success mb5">
                <input type="checkbox" <% if(optimizations.compressCss){ %> checked <% } %> id="checkboxDefault6">
                <label for="checkboxDefault6">Compress all CSS</label>
              </div>
            </div>
            <div class="bs-component">
              <div class="checkbox-custom checkbox-success mb5">
                <input type="checkbox" <% if(optimizations.singleFileCss){ %> checked <% }  %> id="checkboxDefault6">
                <label for="checkboxDefault6">Combine all CSS into single file</label>
              </div>
            </div>
            <div class="bs-component">
              <div class="checkbox-custom checkbox-success mb5">
                <input type="checkbox" <% if(optimizations.compressImg){ %> checked <% } %> id="checkboxDefault5">
                <label for="checkboxDefault5">Compress all images</label>
              </div>
            </div>
            <h5 class="title-divider text-muted mt30 mb10">
              Active Javascript Page Snippets 
              <a style="float: right" href="#">
                <i style="font-size: 18px !important" class="fa fa-question-circle text-info fs12 pl5 pr5"></i>
              </a>
            </h5>
         



            <div id="jssnippets-tree" class="fancytree-radio">
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