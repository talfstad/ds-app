<div class="modal-dialog edit-lander-modal modal-lg">
	<div class=" modal-content">
    	<div class="modal-header">
    		<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    		<h4 class="modal-title" id="myModalLabel"><%= name %></h4>
    	</div>

        <header class="modal-navbar navbar navbar-shadow">

          
    </header>

    	<div class="edit-lander-modal-content modal-body">
        <div class="row">
            <div class="file-list" style="height: 390px; overflow-y: scroll; overflow-x: hidden">
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
            <button type="button" class="btn btn-default btn-clipboard">Close</button>
    		<button type="button" class="btn btn-primary btn-clipboard">Save &amp; Close</button>
    	</div> 
    </div> 
</div>