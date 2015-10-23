
  <div class="panel-group">
    <div class="panel">
      <div class="panel-heading">
        <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#landers-collection" href="#accord<%= id %>">
          <%= name %>
       
        <div class="widget-menu domain-campaign-notification">
           <span class="fs11 text-muted" title="Currently deployed on 2 domains">last updated <%= last_updated %></span>
         <!--  <span class="fs11 text-muted ml10" title="Currently in 2 campaigns"><i class="fa fa-circle text-system fs12 pr5"></i> 2 Campaigns</span> -->
        </div>
         </a>
        <ul class="deploy-status-region nav panel-tabs">
        </ul>
      </div>
      <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
        <div class="panel-menu clearfix">
          <div class="row" style="margin-left: 0px; margin-right: 0px;">
            <div style="margin-left: 5px; padding-top: 10px; float: left;" class="clearfix">
              <!-- <div class="alert alert-micro alert-border-left alert-success pastel alert-dismissable mn">
                <i class="fa fa-info pr10"></i> This lander is <b>currently deployed</b> on the domains listed below.
              </div> -->
              <span style="width: 20px">#</span>
              <span style="margin-left: 15px">Deployed Domains</span>
            </div>
            <div style="float: right;" class="clearfix">
              <div class="bs-component btn-group ml15">
             <!--  <button type="button" class="pl10 pt5 pb5 btn btn-default btn-gradient dark">
                <span class="fa fa-plus pr5"></span>Add to Domain
              </button>
              <button type="button" class="mr10 pl10 pt5 pb5 btn btn-default btn-gradient dark">
                <span class="fa fa-plus pr5"></span>Add to Campaign
              </button> -->

              <!-- <button type="button" class="btn btn-default btn-gradient dark">Add to Campaign</button> -->
              <button type="button" class="btn btn-default btn-gradient dark"><span class="fa fa-cloud-upload pr5"></span>Deploy to New Domain</button>
              </div>
            </div>
          </div>
          <!-- <button type="button" class="btn btn-default light mr10">
              <span class="fa fa-car pr5"></span> Add to Domain</button>
            <button type="button" class="btn btn-info mr10">
              <span class="fa fa-home pr5"></span> Add to Campaign</button> -->
        </div>
        <div class="panel-body">
          <div class="tab-content">
            <div style="padding-bottom: 15px" id="domains-tab-id<%= id %>" class="tab-pane active">
              <table class="table deployed-domains-region"></table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
