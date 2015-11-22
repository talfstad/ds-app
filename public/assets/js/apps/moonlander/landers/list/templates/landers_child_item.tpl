
  <div class="panel-group">
    <div class="panel">
      <div class="panel-heading">
        <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#landers-collection" href="#accord<%= id %>">
          <%= name %>
       
        <div class="widget-menu domain-campaign-notification">
           <span class="fs11 text-muted" title="Currently deployed on 2 domains"><%= last_updated_gui %></span>
        </div>
         </a>
       
        <ul class="nav panel-tabs">
          <li class="campaign-tab-handle-region" data-tab-target="campaigns-tab-id-<%= id %>"></li>
          <li class="deploy-status-region" data-tab-target="domains-tab-id-<%= id %>"></li>
        </ul>
      </div>
      <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
        <div class="tab-content">
          <div class="tab-pane " role="tabpanel" id="domains-tab-id-<%= id %>">
            <div class="panel-menu clearfix">
              <div class="row" style="margin-left: 0px; margin-right: 0px;">
                <div style="margin-left: 5px; padding-top: 10px; float: left;" class="clearfix">
                  <span style="width: 20px">#</span>
                  <span style="margin-left: 15px">Deployed Domains</span>
                </div>
                <div style="float: right;" class="clearfix">
                  <div class="bs-component btn-group ml15">

                  <% if(deploy_status !== "initializing") { %>
                  
                  <button type="button" class="deploy-to-domain btn btn-default btn-gradient dark"><span class="fa fa-cloud-upload pr5"></span>Deploy to New Domain</button>
                  
                  <% } else { %>

                  <button type="button" class="disabled deploy-to-domain btn btn-default btn-gradient dark"><span class="fa fa-cloud-upload pr5"></span>Deploy to New Domain</button>

                  <% } %>

                  </div>
                </div>
              </div>
            </div>
            <div class="panel-body">
              <div style="padding-bottom: 15px">
                <table class="table deployed-domains-region"></table>
              </div>
            </div>
          </div>

          <div class="tab-pane" role="tabpanel" id="campaigns-tab-id-<%= id %>">
            <div class="panel-menu clearfix">
              <div class="row" style="margin-left: 0px; margin-right: 0px;">
                <div style="margin-left: 5px; padding-top: 10px; float: left;" class="clearfix">
                  <span style="width: 20px">#</span>
                  <span style="margin-left: 15px">Current Campaigns</span>
                </div>
                <div style="float: right;" class="clearfix">
                  <div class="bs-component btn-group ml15">
                  
                    <% if(deploy_status !== "initializing") { %>
                    
                    <button type="button" class="add-to-campaign btn btn-default btn-gradient dark"><span class="fa fa-plus pr5"></span>Add to New Campaign</button>
                    
                    <% } else { %>

                    <button type="button" class="disabled add-to-campaign btn btn-default btn-gradient dark"><span class="fa fa-plus pr5"></span>Add to New Campaign</button>

                    <% } %>

                  </div>
                </div>
              </div>
             </div>
            <div class="panel-body">
              <div style="padding-bottom: 15px">
                <table class="table active_campaigns_region"></table>
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  </div>
