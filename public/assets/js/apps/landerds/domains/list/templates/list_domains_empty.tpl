<div style="min-height: 400px; width: 100%; text-align: center" class="empty-domains">
  <div style="display: inline-block; margin-top: 0px">
    <% if(showAwsHelp) { %>
      <div style="width: 600px; text-align: left">
        <h3>
      		Welcome to LanderDS!
      	</h3>
        <h4>
           Step 1: Connect your AWS account.
        </h4>
        <p> Before you can use LanderDS, you must connect it to your AWS account. The video below will show you where to get your AWS account information to safely and securely connect the accounts.</p>
        <div style="margin: 30px 0; width: 100%">
          <a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/L9szn1QQfas?autoplay=1&amp;wmode=opaque" rel="gallery">
            <img style="width: 600px;" src="/assets/img/deploywithclick.png" alt="How to set up aws video" /></a>
          <div style="position: relative; bottom: 120px; width: 100%; margin-left: 0px;">
            <h3 style="padding: 15px 0; background: rgba(0,0,0,0.5); width: 100%; text-align: center">
		Watch Video
	</h3>
          </div>
        </div>
      </div>
      <% } else { %>

      <% if(filterVal === "") { %>
        <div style="width: 600px; text-align: left">
        <h3>
          Welcome to Domains!
        </h3>
        <h4>
           Learn how to use domains and deploy landers to them.
        </h4>
        <p>In this video we'll cover how to add a domain you've purchased, as well as deploying a landing page to it.</p>
        <div style="margin: 30px 0; width: 100%">
          <a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/L9szn1QQfas?autoplay=1&amp;wmode=opaque" rel="gallery">
            <img style="width: 600px;" src="/assets/img/deploywithclick.png" alt="How to set up aws video" /></a>
          <div style="position: relative; bottom: 120px; width: 100%; margin-left: 0px;">
            <h3 style="padding: 15px 0; background: rgba(0,0,0,0.5); width: 100%; text-align: center">
    Watch Video
  </h3>
          </div>
        </div>
      </div>

      <% } else { %>

      <div style="margin-top: 70px">
        <h2 style="display: inline" class="text-muted"><span class="fa fa-warning"></span> You Don't Have Any Domains With </h2><h1 style="display: inline" > <%= filterVal %> </h1><h2 style="display: inline" class="text-muted"> in the Name </h2>
      </div>

      <% } %>

        
        <% } %>
  </div>
</div>
