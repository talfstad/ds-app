<div class="modal-dialog edit-lander-modal modal-lg">
	<div class=" modal-content">
    	<div class="modal-header">
    		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    		<h4 class="modal-title" id="myModalLabel"><%= name %></h4>
    	</div>

        <header class="modal-navbar navbar navbar-shadow">
            <div style="width: 100%; margin-top: 5px; margin-left: 15px; float: left;">
                <div style="float: left; min-width: 220px">
                 <button type="button" class="mr5 pl10 pt5 pb5 btn btn-default btn-gradient dark">
                        <span class="fa fa-file pr5"></span></span>New File
                    </button>
                    <button type="button" class="mr5 pl10 pt5 pb5 btn btn-default btn-gradient dark">
                        <span class="fa fa-folder pr5"></span></span>New Folder
                    </button>
                </div>
                <div style="float: left; width: calc(100% - 220px);">
                    <div style="width: calc(100% - 241px); min-width: 50px; float: left">
                        <div class="input-group">
                            <span class="input-group-addon" style="color: #666; padding-top: 0; padding-bottom: 0">
                                  /
                              </span>
                          <input style="height: 31px" class="form-control" type="text" value="jquery.js" placeholder="Numbers">
                           <span class="input-group-addon" style="color: #666; padding-top: 0; padding-bottom: 0">
                                  <span class="fa fa-pencil-square-o pr5"></span></span>
                              </span>
                        </div>
                    </div>
                
                    <div style="float: right; margin-right: 25px">
                       
                
                        <button type="button" class="mr5 pl10 disabled pt5 pb5 btn btn-default btn-gradient dark">
                           <span class="fa fa-floppy-o pr5"></span></span>Save File
                        </button>

                         <button type="button" class="mr5 pl10 pt5 pb5 btn btn-danger btn-gradient dark">
                            <span class="fa fa-trash pr5"></span></span>Delete File
                        </button>
                    </div>
              </div>
            </div>
        </header>

    	<div class="edit-lander-modal-content modal-body">
        <div class="row">
            <div class="file-list" style="overflow-y: auto">
                <div id="tree6" class="edit-lander-container ui-draggable-handle">
                    
              <ul id="treeData" style="display: none;" class="ui-fancytree-source ui-helper-hidden">
                <li class="fancytree-page">
                    <span>index.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index2.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index3.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index4.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index11.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index12.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index13.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index14.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index5.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index6.html</span>
                </li>
                <li class="fancytree-page">
                    <span>index7.html</span>
                </li>

                <li class="fancytree-page folder">css
                  <ul>
                    <li>
                      <span>
                        styles.css
                      </span>
                    </li>
                    <li>
                      <span>
                        styles2.css
                      </span>
                    </li>
                  </ul>
                </li>
                <li class="fancytree-page folder">js
                  <ul>
                    <li>
                      <span>
                        bootstrap.js
                      </span>
                    </li>
                    <li>
                      <span>
                        jquery.js
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>


                </div>
            </div>
            <div class="code-pane resize-edit">
                <form>        		
        			<textarea style="display: none" id="code-area"></textarea>
                </form>
            </div>
    	</div>
        </div>
    	<div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-default btn-clipboard">Close</button>
    		<button type="button" class="btn btn-success btn-clipboard">Save &amp; Close</button>
    	</div> 
    </div> 
</div>
<div id="edit-modal-region"></div>