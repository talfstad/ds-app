<% if(true) { %>

<div class="bs-component">
  <div class="panel-group accordion">
    <div class="panel">
      <div class="panel-heading">
        <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#accordion" href="#accord<%= id %>">
          <%= name %>
       
        <div class="widget-menu domain-campaign-notification">
           <span class="fs11 text-muted" title="Currently deployed on 2 domains">last updated 3/4/15</span>
         <!--  <span class="fs11 text-muted ml10" title="Currently in 2 campaigns"><i class="fa fa-circle text-system fs12 pr5"></i> 2 Campaigns</span> -->
        </div>
         </a>
        <ul class="nav panel-tabs">
        <% if(!deploying && deployed) { %>
          <li>
            <a href="#domains-tab-id<%= id %>" data-toggle="tab">
              <span class="open_sidemenu_r label bg-success">
                Deployed
              </span></a>
          </li>
        <% } else if(deploying){ %>
          <li>
            <a href="#domains-tab-id<%= id %>" data-toggle="tab">
              <span class="open_sidemenu_r label bg-warning">
                 <span style="margin-left: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Deploying
              </span>
            </a>
          </li>
        <% } else { %>
          <li>
            <a href="#domains-tab-id<%= id %>" data-toggle="tab">
              <span class="open_sidemenu_r label bg-danger">
                 Not Deployed
              </span>
            </a>
          </li>
        <% } %>
        </ul>
      </div>
      <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
        <div class="panel-menu clearfix">
          <div class="row">
            <div class="col-md-8">
              <div class="alert alert-micro alert-border-left alert-success pastel alert-dismissable mn">
                <i class="fa fa-info pr10"></i> This lander is <b>currently deployed</b> on the domains listed below.
              </div>
            </div>
            <div class="col-md-4">
              <div class="bs-component btn-group ml15">
                <button type="button" class="btn btn-default btn-gradient dark">Add to Domain</button>
                <button type="button" class="btn btn-default btn-gradient dark">Add to Campaign</button>
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
            <div id="domains-tab-id<%= id %>" class="tab-pane active">
              <div id="tree<%= id %>" class="fancytree-radio">
                <ul id="treeData" style="display: none;" class="ui-fancytree-source ui-helper-hidden">
                  <li id="5.7" class="fancytree-domain expanded">hardbodiesandboners.org
                    <ul>
                      <li id="5.81" data-hey="true">
                        <span>
                          targeted Camp 1:  <a class="domain-link" target="_blank" href="http://www.hardbodiesandboners.org/campaign2/extreme">hardbodiesandboners.org/sexsexsex/extreme/</a> 
                          <select class="domain-endpoint-select form-control">
                            <option>index.html</option>
                            <option>index3.html</option>
                            <option>otherlander/safe_page.html</option>
                          </select>

                          <a class="trash-link" title="Undeploy" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        </span></li>
                      <li id="5.83">
                        <span>
                          RON camp test: <a class="domain-link" target="_blank" href="http://www.hardbodiesandboners.org/campaign2/extreme">hardbodiesandboners.org/creamy/extreme/</a> 
                          <select class="domain-endpoint-select form-control">
                            <option>index.html</option>
                            <option>index3.html</option>
                            <option>otherlander/safe_page.html</option>
                          </select>
                          <a class="trash-link" title="Undeploy" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        </span>
                      </li>
                    </ul>
                  </li>
                  <li id="5.7" class="fancytree-domain expanded">weightlosskey.com
                    <ul>
                      <li id="5.81" data-hey="true">
                        <span>
                          Jim RON camp: <a class="domain-link" target="_blank" href="http://www.hardbodiesandboners.org/campaign2/extreme">weightlosskey.com/hottest/extreme/</a> 
                          <select class="domain-endpoint-select form-control">
                            <option>index.html</option>
                            <option>index3.html</option>
                            <option>otherlander/safe_page.html</option>
                          </select>
                          <a class="trash-link" title="Undeploy" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        </span></li>
                      <li id="5.83">
                        <span>
                          Jim's targeted on ZP: <a class="domain-link" target="_blank" href="http://www.hardbodiesandboners.org/campaign2/extreme">weightlosskey.com/hot/extreme/</a> 
                          <select class="domain-endpoint-select form-control">
                            <option>index.html</option>
                            <option>index3.html</option>
                            <option>otherlander/safe_page.html</option>
                          </select>
                          <a class="trash-link" title="Undeploy" href="#"><i class="pull-right ml15 mt3 fa fa-trash-o"></i></a>
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<% } else { %>


<div class="bs-component">
  <div class="panel-group accordion">
    <div class="panel">
      <div class="panel-heading">
        <a class="accordion-toggle accordion-icon link-unstyled" data-toggle="collapse" data-parent="#accordion" href="#accord<%= id %>">
          Weight Loss Lander version 1
       
        <div class="widget-menu domain-campaign-notification">
          <span class="fs11 text-muted" title="Currently deployed on 0 domains">
          Not Deployed</span>
          <!-- <span class="fs11 text-muted ml10" title="Currently in 0 campaigns"><i class="fa fa-circle text-system fs12 pr5"></i> 0 Campaigns</span> -->
        </div>
         </a>
        <ul class="nav panel-tabs">
          <li>
            <a href="#domains-tab-id<%= id %>" data-toggle="tab">
              <span class="open_sidemenu_r label bg-warning">
                                       <span style="margin-left: 5px; font-size: 12px" class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Deploying
              </span>
            </a>
          </li>
        </ul>
      </div>
      <div id="accord<%= id %>" class="panel-collapse collapse" style="height: auto;">
        <div class="panel-menu clearfix">
          <div class="row">
            <div class="col-md-8">
              <div class="alert alert-micro alert-border-left alert-danger pastel alert-dismissable mn">
                <i class="fa fa-danger pr10"></i> This lander does not currently belong to any domains or campaigns.
              </div>
            </div>
            <div class="col-md-4">
              <div class="bs-component btn-group ml15">
                <button type="button" class="btn btn-default btn-gradient dark">Add to Domain</button>
                <button type="button" class="btn btn-default btn-gradient dark">Add to Campaign</button>
              </div>
            </div>
          </div>
          <!-- <button type="button" class="btn btn-default light mr10">
              <span class="fa fa-car pr5"></span> Add to Domain</button>
            <button type="button" class="btn btn-info mr10">
              <span class="fa fa-home pr5"></span> Add to Campaign</button> -->
        </div>
      </div>
    </div>
  </div>
</div>

<% } %>