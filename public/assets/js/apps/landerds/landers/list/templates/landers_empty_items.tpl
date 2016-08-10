<div style="min-height: 400px; width: 100%; text-align: center" class="empty-landers">
  <div style="display: inline-block; margin-top: 0px">

      <% if(filterVal === "") { %> 
        <div style="width: 600px; text-align: left">
        <h3>
          Welcome to Landing Pages!
        </h3>
        <h4>
           Learn how to add, optimize, deploy, and edit your landing pages.
        </h4>
        <p>In this video we'll cover how to rip or upload a landing page, edit it, optimize it for quick load times, add a javascript snippet to it, and finally deploy it live to begin converting.</p>
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
        <h2 style="display: inline" class="text-muted"><span class="fa fa-warning"></span> You Don't Have Any Landers With </h2><h1 style="display: inline" > <%= filterVal %> </h1><h2 style="display: inline" class="text-muted"> in the Name </h2>
      </div>

      <% } %>

  </div>
</div>
