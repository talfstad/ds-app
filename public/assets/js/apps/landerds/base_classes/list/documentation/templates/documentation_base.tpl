<div class="container">
  <div class="docs-container" id="docs">
    <div class="row table-layout">
      <!-- Documentation Nav -->
      <div class="col-left-documentation left-col">
        <aside id="sidebar_left" class="nano nano-light">
          <!-- Start: Sidebar Left Content -->
          <div class="sidebar-left-content nano-content">
            <!-- Start: Sidebar Menu -->
            <ul class="ohidden nav sidebar-menu">
              <li class="sidebar-label pt20">Account</li>
              <li>
                <a class="accordion-toggle" href="#">
                  <span class="glyphicon glyphicon-fire"></span>
                  <span class="sidebar-title">Setting up AWS</span>
                  <span class="caret"></span>
                </a>
                <ul class="nav sub-nav">
                  <li>
                    <a data-toggle="tab" href="#introduction">
                      <span class="glyphicon glyphicon-equalizer"></span> General </a>
                  </li>
                  <li>
                    <a data-toggle="tab" href="#rip-and-add-lander">
                      <span class="glyphicon glyphicon-book"></span> Rip And Add Lander </a>
                  </li>
                  <li>
                    <a href="#optimization" data-toggle="tab">
                      <span class="glyphicon glyphicon-modal-window"></span> Optimization </a>
                  </li>
                </ul>
              </li>
              <li class="sidebar-label pt20">Landing Pages</li>
              <li>
                <a class="accordion-toggle" href="#">
                  <span class="glyphicon glyphicon-fire"></span>
                  <span class="sidebar-title">Admin Plugins</span>
                  <span class="caret"></span>
                </a>
                <ul class="nav sub-nav">
                  <li>
                    <a href="admin_plugins-panels.html">
                      <span class="glyphicon glyphicon-book"></span> Admin Panels </a>
                  </li>
                  <li>
                    <a href="admin_plugins-modals.html">
                      <span class="glyphicon glyphicon-modal-window"></span> Admin Modals </a>
                  </li>
                  <li>
                    <a href="admin_plugins-dock.html">
                      <span class="glyphicon glyphicon-equalizer"></span> Admin Dock </a>
                  </li>
                </ul>
              </li>
              <li class="sidebar-label pt20">Domains</li>
              <li>
                <a class="accordion-toggle" href="#">
                  <span class="glyphicon glyphicon-check"></span>
                  <span class="sidebar-title">Add New</span>
                  <span class="caret"></span>
                </a>
                <ul class="nav sub-nav">
                  <li>
                    <a href="admin_forms-elements.html">
                      <span class="glyphicon glyphicon-edit"></span> Admin Elements </a>
                  </li>
                  <li>
                    <a href="admin_forms-widgets.html">
                      <span class="glyphicon glyphicon-calendar"></span> Admin Widgets </a>
                  </li>
                  <li>
                    <a href="admin_forms-validation.html">
                      <span class="glyphicon glyphicon-check"></span> Admin Validation </a>
                  </li>
                  <li>
                    <a href="admin_forms-layouts.html">
                      <span class="fa fa-desktop"></span> Admin Layouts </a>
                  </li>
                  <li>
                    <a href="admin_forms-wizard.html">
                      <span class="fa fa-clipboard"></span> Admin Wizard </a>
                  </li>
                </ul>
              </li>
              <li class="sidebar-label pt20">Groups</li>
              <li>
                <a class="accordion-toggle" href="#">
                  <span class="glyphicon glyphicon-check"></span>
                  <span class="sidebar-title">Add</span>
                  <span class="caret"></span>
                </a>
                <ul class="nav sub-nav">
                  <li>
                    <a href="admin_forms-elements.html">
                      <span class="glyphicon glyphicon-edit"></span> Admin Elements </a>
                  </li>
                  <li>
                    <a href="admin_forms-widgets.html">
                      <span class="glyphicon glyphicon-calendar"></span> Admin Widgets </a>
                  </li>
                  <li>
                    <a href="admin_forms-validation.html">
                      <span class="glyphicon glyphicon-check"></span> Admin Validation </a>
                  </li>
                  <li>
                    <a href="admin_forms-layouts.html">
                      <span class="fa fa-desktop"></span> Admin Layouts </a>
                  </li>
                  <li>
                    <a href="admin_forms-wizard.html">
                      <span class="fa fa-clipboard"></span> Admin Wizard </a>
                  </li>
                </ul>
              </li>
            </ul>
            <!-- End: Sidebar Menu -->
          </div>
          <!-- End: Sidebar Left Content -->
        </aside>
      </div>
      <!-- Documentation Content -->
      <div class="fs15 col-right-documentation center-col va-t">
        <div id="docs-content" class="tab-content pn">
          <!-- GENERAL -->
          <div class="tab-pane fade" id="introduction" role="tabpanel">
            <section class="bs-docs-section">
              <div id="nav-spy" class="fs15 left-table-of-contents " style="">
                <aside class="" style="">
                  <div class="nav-spy">
                    <ul class="nav tray-nav tray-nav-border">
                      <li class="active">
                        <a href="#amazon-web-services">
                  Amazon Web Services</a>
                      </li>
                      <li class="">
                        <a href="#navigation">
                  Navigation</a>
                      </li>
                      <li class="">
                        <a href="#password-reset">
                  Password Reset</a>
                      </li>
                      <li class="">
                        <a href="#search-and-sort">
                  Search and Sort</a>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>
              <div class="documentation-content-text-container">
                <h1 class="page-header">Lander DS </h1>
                <h2 id="amazon-web-services">Amazon Web Services</h2>
                <h3>Upon logging in for the first time:</h3>
                <p>Create an AWS account if you don't already have one. Follow the instructions provided on the panel to establish your credentials. You will not be able to proceed until you have set up your AWS account.
                  <br>
                </p>
                <div class="bs-example">
                  <img src="/assets/img/documentation/aws.png" alt="AWS" style="width:640px;height:360px;">
                </div>
                <h2 id="navigation">Navigation</h2>
                <div class="bs-example">
                  <p> On the top left of the panel, you will find that you can navigate between Landing Pages, Groups, and Domains. The sorting, paging, and search also show up on the top left corner of the panel for all three items.</p>
                  <img src="/assets/img/documentation/navigation.png" alt="Navigation" style="width:640px;height:360px;">
                  <br>
                  <br>
                  <p> The top right of the panel displays your log in. This is where you can log out of Lander DS or update your AWS credentials. On Landing pages, the rip and add funtions show up here. For domains and groups, the add function is displayed in this area. The illustrations show the columns that are displayed for each item.</p>
                  <img src="/assets/img/documentation/navigation1.png" alt="Navigation" style="width:640px;height:360px;">
                  <br>
                  <br>
                  <p> On the bottom right corner of the Lander DS panel, you'll find a blue speech bubble. Click on this to message Lifen or Trevor directly! We will respond within 24 hours.</p>
                  <img src="/assets/img/documentation/navigation2.png" alt="Navigation" style="width:640px;height:360px;">
                </div>
                <h2 id="password-reset">Password Reset</h2>
                <h3>How do I reset my password?</h3>
                <p> 1. Click on "Forgot Password" on the top right corner of the log-in page.
                  <br>2. Enter the email which you use to log in with.
                  <br>3. Check your email for a message from "Trevor" from Lander DS.
                  <br>4. Choose a new password and confirm it.
                  <br>5. Click the blue "Reset Password" button on the bottom right corner.</p>
                <div class="bs-example">
                  <img src="/assets/img/documentation/select.password.png" alt="Select Password" style="width:640px;height:360px;">
                </div>
                <h2 id="search-and-sort">Seach and Sort</h2>
                <h3>How do I search for a landing page, note, or domain?</h3>
                <p>1. Go to the panel of the item you'd like to search: landing pages, groups, or domains.
                  <br>2. Type in the key words that you'd like to search.
                  <br>3. Choose whether you'd like to search just the item, if you would like to search within the notes, or both.</p>
                <h3>Sorting</h3>
                <p>You can sort your landing pages, groups, and domains in groups of 10 per page, 20 per page, or 50 per page. You can also sort them by name in alpha-numerical order or by the "created on" date both in either ascending or descending order. You can also use the search option to sort whatever items you wish to work on.</p>
                <div class="bs-example">
                  <img src="/assets/img/documentation/search.png" alt="Select Password" style="width:640px;height:360px;">
                </div>
              </div>
            </section>
          </div>
          <!-- LANDING PAGES -->
          <div class="tab-pane fade" id="rip-and-add-lander" role="tabpanel">
            <h3 id="" class="page-header">Rip and Add </h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">How do I rip a landing page?</h2>
              <h3>On the Landing Page Tab:</h3>
              <p>1. Click the "Rip Lander" button.
                <br>2. Choose a name for your lander and type it into the "New Lander Name" bar.
                <br>3. Type or paste the URL of the landing page you wish to rip into the "Lander URL" bar.
                <br>4. Click the blue "Rip New Lander" button.</p>
              <h3>Advanced Settings:</h3>
              <p><b>Version:</b>
                <br>Choose whether you would like to rip the desktop version or the mobile version of the desired landing page.
                <br><b>Depth:</b>
                <br>If you wish to rip the links that are on the original URL, you can choose how many layers to rip up to 3 layers.
                <br>
              </p>
              <div class="bs-example">
                <img src="/assets/img/documentation/rip.lander.png" alt="Rip Lander" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">How do I add a new landing page?</h2>
              <h3>On the Landing Page Tab:</h3>
              <p>1. Click the "+ New Lander" button.
                <br>2. Choose a name for your lander and type it into the "New Lander Name" bar.
                <br>3. Either drag and drop your zip file into the designated box or locate your landing page by clicking the blue "Browse" button.
                <br>4. Click the blue "Add New Lander" button.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/add.lander.png" alt="Rip Lander" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">How should I format my zip file for upload?</h2>
              <p>Format your landing page in a zip file that contains the index page and all of the resource files. This should include the CSS, JavaScript, and image folders.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/zip.png" alt="Zip" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- OPTIMIZATION -->
          <div class="tab-pane fade" id="optimization" role="tabpanel">
            <h3 id="" class="page-header">Optimization </h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">How does the Optimization feature work?</h2>
              <p><b>On the Landing Page Tab:</b>
                <br>Gzip compression for landing pages
                <br>Lossless compression for images
                <br>Minify CSS, html, and JavaScript
                <br>Inline scripts above the fold</p>
              <h2 id="text-contextuals">Google PageSpeed</h2>
              <h3>What is Google PageSpeed Insights?</h3>
              <p>Google PageSpeed Insights is a comprehensive analysis that helps you to identify ways to make your site run faster and more mobile-friendly.</p>
              <p>Read about Google PageSpeed Insights <a href="https://developers.google.com/speed/docs/insights/about?hl=en-US&amp;utm_source=PSI&amp;utm_medium=incoming-link&amp;utm_campaign=PSI" target="blank">here.</a></p>
              <h3>How do I use Google PageSpeed Insights?</h3>
              <div class="bs-example">
                <img src="/assets/img/documentation/google.pagespeed.png" alt="Google Pagespeed">
              </div>
              <h2 id="text-contextuals">Yslow Load Time</h2>
              <h3>What is Yslow Load Time?</h3>
              <p>Your Yslow Load Time tells you how fast each landing page loads on the domain that it is deployed on.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/yslow.png" alt="YSlow">
              </div>
            </div>
          </div>
          <!-- EDIT -->
          <div class="tab-pane fade" id="edit" role="tabpanel">
            <h3 id="" class="page-header">Edit Your Landing Page </h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">Edit Coming Soon!</h2>
              <h3></h3>
              <p>Please check back. We're constantly updating!</p>
              <div class="bs-example">
              </div>
            </div>
          </div>
          <!-- SNIPPETS -->
          <div class="tab-pane fade" id="snippets" role="tabpanel">
            <h3 id="" class="page-header">JavaScript Snippets </h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">What is a snippet?</h2>
              <p> Lander DS' JavaScript Snippets are small pieces of re-usable source code that are provided for users to incorporate into their landing pages. We provide several pre-made snippets that you can easily insert into your code. Simply choose the snippet you would like to insert from the left side menu, edit it if necessary, and click "Add to Page." If you'd like to create your own snippet, you can click the "Create New Snippet" button on the bottom left corner of the pop up and insert your own code.</p>
              <p>
              </p>
              <div class="bs-example">
                <img src="/assets/img/documentation/snippet.png" alt="Snippet" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- OTHER RIGHT-HAND PANEL ACTIONS -->
          <div class="tab-pane fade" id="other-right-hand-panel-actions" role="tabpanel">
            <h3 id="" class="page-header">Other Right-Hand Panel Actions </h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">Deployment Folder Name</h2>
              <p> You can customize your deployment folder name. Each deployment folder name must be unique. Choose the name you would like for each lander, and type it into the "Deployment Folder Name" box. If your lander is already deployed and you change your deployment folder name, you must re-deploy your lander.
              </p>
              <div class="bs-example">
                <img src="/assets/img/documentation/deployment.folder.png" alt="Copy" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">Copy</h2>
              <h3>To create a copy of an existing landing page:</h3>
              <p>1. Click on the "Landing Pages" tab.
                <br>2. Click on the "Copy" button in the right-hand panel.
                <br>3. Choose a name for the new landing page and type it into the "New Lander Name" bar.
                <br>4. Click the blue "Create Copy" button.
              </p>
              <div class="bs-example">
                <img src="/assets/img/documentation/copy.png" alt="Copy" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">Save and Deploy</h2>
              <h3>How do I save changes made to a landing page outside of the Edit box?</h3>
              <p>To save changes to a landing page outside of Edit, click the "Save Button" in the right-hand panel. The addition or removal of a JavaScript Snippet or a change to the Deployment Folder Name will need to be saved or re-deployed.</p>
              <h3>Why do I see a "Deploy" button instead of a "Save" button on the right-hand panel?</h3>
              <p>If your landing page is currently deployed to a domain, any changes made to the landing page will need to be re-deployed. Click the "Deploy" button in the right-hand panel to re-deploy your updated lander. This will automatically save your changes and re-deploy the landing page in one action. Note: A re-deploy of a landing page may take up to 20 minutes.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/save.png" alt="Preview" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">Preview</h2>
              <h3>How do I preview my undeployed landing page?</h3>
              <p>To preview your landing page, click on the "Preview" button (eye icon) in the right-hand panel.</p>
              <h3>How do I preview my optimized, undeployed landing page?</h3>
              <p>To preview your optimized, undeployed landing page, click on the "Preview" button (eye icon) in the right-hand panel. Replace the word "original" with "optimized" in the URL bar.</p>
              <h3>How do I preview my deployed landing page?</h3>
              <p>To preview your deployed landing page, find the domain that you would like to view under the "Deployed Domain" column, and click on the Eye Icon to the right of the link.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/preview.png" alt="Preview" style="width:640px;height:360px;">
                <br>
                <br>
                <img src="/assets/img/documentation/preview1.png" alt="Preview" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">Download</h2>
              <p> You can take your landing pages with you anywhere by downloading them. On the bottom of the right hand panel, you can choose to download the original or the optimized version of your landing page.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/download.png" alt="Download" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">Delete</h2>
              <p>To delete a landing page, click on the red "Delete Lander" button on the bottom of the right-hand panel. If the landing page was broken, you can report that to us by clicking "Report This Lander Broken" before deleting.
                <br>Note: Deleting a deployed landing page will undeploy the lander and may take up to 20 minutes.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/delete.lander.png" alt="Delete" style="width:640px;height:360px;">
                <br>
                <br>
                <img src="/assets/img/documentation/broken.png" alt="Delete" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- DEPLOY -->
          <div class="tab-pane fade" id="deploy" role="tabpanel">
            <h3 id="" class="page-header">Deploy Your Landing Page </h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">How do I deploy a landing page to a domain?</h2>
              <h3>On the Landing Page Tab:</h3>
              <p>1. Click on the landing page you wish to deploy.
                <br>2. Click on the "Domain" tab on the landing page row.
                <br>3. Click the "+" icon.
                <br>4. Click on the domain to which you would like to deploy your landing page.
                <br>5. Click the blue "Deploy Lander" button.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/lander.deploy.png" alt="Deploy Lander" style="width:640px;height:360px;">
              </div>
              <h3>On the Domains Tab:</h3>
              <p>1. Click on the domain to which you would like to deploy your landing page.
                <br>2. Click on the "Landers" tab on the domain row.
                <br>3. Click the "+" icon.
                <br>4. Click on the landing page you wish to deploy.
                <br>Click the blue "Deploy Lander" button.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/deploy.domain.lander.png" alt="Deploy Lander" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- GROUPS - GENERAL -->
          <div class="tab-pane fade" id="groups-general" role="tabpanel">
            <h3 id="" class="page-header">General</h3>
            <div class="bs-docs-section">
              <!-- Contextuals -->
              <h2 id="text-contextuals">What is the purpose of the "Groups" feature?</h2>
              <p> Groups is an organizational tool that allows you to add a single or multiple landing pages to a single or multiple domains. See the Set-Up, Landing Pages, and Domains tabs for more information.</p>
            </div>
          </div>
          <!-- GROUPS - SET-UP -->
          <div class="tab-pane fade" id="groups-set-up" role="tabpanel">
            <h3 id="" class="page-header">Set-Up</h3>
            <div class="bs-docs-section">
              <!-- Contextuals -->
              <h2 id="text-contextuals">How do I add a group?</h2>
              <p>1. Click the "+ New Group" button.
                <br>2. Choose a name for your group and type it into the "Group Name" bar.
                <br>3. Click the blue "Add Group" button.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/add.group.png" alt="Add Groups" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- GROUPS - LANDING PAGES -->
          <div class="tab-pane fade" id="groups-landing-pages" role="tabpanel">
            <h3 id="" class="page-header">Landing Pages</h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">How do I add a landing page to a group?</h2>
              <h3> Option 1: From Landing Pages</h3>
              <p> 1. Click on the landing page you'd like to add to a group.
                <br>3. Click the "+" sign on the tab.
                <br>4. Click on the group that you'd like to add the landing page to.
                <br>5. Click the blue "Add Group" on the bottom right corner of the pop-up.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/groups.png" alt="Groups" style="width:640px;height:360px;">
              </div>
              <h3> Option 2: From Groups</h3>
              <p> 1. Click on the group you'd like to add a landing page to.
                <br>2. Click the "Landers" tab within the group.
                <br>3. Click the "+" sign on the tab.
                <br>4. Click on the landing page you'd like to add to the group.
                <br>5. Click "Add Lander" on the bottom right corner of the pop-up.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/add.lander.group.png" alt="Groups" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- GROUPS - DOMAINS -->
          <div class="tab-pane fade" id="groups-domains" role="tabpanel">
            <h3 id="" class="page-header">Domains</h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">How do I deploy a group of landers to a domain?</h2>
              <h3> Option 1: From Domains</h3>
              <p> 1. Click on the domain you'd like to add to a group to.
                <br>3. Click the "+" sign on the tab.
                <br>4. Click on the group that you'd like to add to the domain.
                <br>5. Click the blue "Add Group" on the bottom right corner of the pop-up.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/deploy.group.png" alt="Groups" style="width:640px;height:360px;">
              </div>
              <h3> Option 2: From Groups</h3>
              <p> 1. Click on the group you'd like to add to a domain.
                <br>2. Click the "Domains" tab within the group.
                <br>3. Click the "+" sign on the tab.
                <br>4. Click on the domain you'd like to add the group to.
                <br>5. Click "Add Domain" on the bottom right corner of the pop-up.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/deploy.group.domain.png" alt="Groups" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <!-- DOMAINS - SET-UP -->
          <div class="tab-pane fade" id="domains-set-up" role="tabpanel">
            <h3 id="" class="page-header">Set-Up</h3>
            <div class="bs-docs-section">
              <h2 id="text-contextuals">How do I add a domain?</h2>
              <h3>On the Domains Tab:</h3>
              <p>1. Click the "+ New Domain" button.
                <br>2. Type in the URL of a domain that you own.
                <br>3. Click the blue "Add Domain" button.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/add.domain.1.png" alt="Add Domain" style="width:640px;height:360px;" vspace="20">
                <img src="/assets/img/documentation/add.domain.png" alt="Add Domain" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">How do I add a subdomain?</h2>
              <h3>On the Domains Tab:</h3>
              <p>1. Click the "+ New Domain" button.
                <br>2. Type in the URL of a subdomain of your domain.
                <br>3. Click the blue "Add Domain" button.
                <br><b>Note: Add the root domain first, and then add your subdomains.</b></p>
              <div class="bs-example">
                <img src="/assets/img/documentation/subdomain.png" alt="Add Domain" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">How do I update my nameservers?</h2>
              <p>To update your nameservers, locate the four nameservers on the top of the right-hand panel of your new domain. Go to the platform on which you own your URL, and update the nameservers according to the instructions.</p>
              <div class="bs-example">
                <img src="/assets/img/documentation/add.nameservers.png" alt="Update Nameservers" style="width:640px;height:360px;">
              </div>
              <h2 id="text-contextuals">What if I use a different CDN?</h2>
              <p>Your alternate DNS records are located just below the Domain Name Servers in the right-hand panel of each domain. Take the alternate DNS records to the CDN that you'd like to use to route your landing pages.</p>
              <div class="bs-example">
                <p>Coming Soon!</p>
              </div>
            </div>
          </div>
          <!-- DOMAINS - LANDING PAGES -->
          <div class="tab-pane fade" id="domains-landing-pages" role="tabpanel">
            <h3 id="" class="page-header">Landing Pages</h3>
            <h2 id="text-contextuals">How do I deploy a landing page to a domain?</h2>
            <h3>On the Landing Page Tab:</h3>
            <p>1. Click on the landing page you wish to deploy.
              <br>2. Click on the "Domain" tab on the landing page row.
              <br>3. Click the "+" icon.
              <br>4. Click on the domain to which you would like to deploy your landing page.
              <br>5. Click the blue "Deploy Lander" button.</p>
            <div class="bs-example">
              <img src="/assets/img/documentation/lander.deploy.png" alt="Deploy Lander" style="width:640px;height:360px;">
            </div>
            <h3>On the Domains Tab:</h3>
            <p>1. Click on the domain to which you would like to deploy your landing page.
              <br>2. Click on the "Landers" tab on the domain row.
              <br>3. Click the "+" icon.
              <br>4. Click on the landing page you wish to deploy.
              <br>Click the blue "Deploy Lander" button.</p>
            <div class="bs-example">
              <img src="/assets/img/documentation/deploy.domain.lander.png" alt="Deploy Lander" style="width:640px;height:360px;">
            </div>
          </div>
          <!-- DOMAINS - GROUPS -->
          <div class="tab-pane fade" id="domains-groups" role="tabpanel">
            <h3 id="" class="page-header">Groups</h3>
            <h2 id="text-contextuals">How do I deploy a group of landers to a domain?</h2>
            <h3> Option 1: From Domains</h3>
            <p> 1. Click on the domain you'd like to add to a group to.
              <br>3. Click the "+" sign on the tab.
              <br>4. Click on the group that you'd like to add to the domain.
              <br>5. Click the blue "Add Group" on the bottom right corner of the pop-up.</p>
            <div class="bs-example">
              <img src="/assets/img/documentation/deploy.group.png" alt="Groups" style="width:640px;height:360px;">
            </div>
            <h3> Option 2: From Groups</h3>
            <p> 1. Click on the group you'd like to add to a domain.
              <br>2. Click the "Domains" tab within the group.
              <br>3. Click the "+" sign on the tab.
              <br>4. Click on the domain you'd like to add the group to.
              <br>5. Click "Add Domain" on the bottom right corner of the pop-up.</p>
            <div class="bs-example">
              <img src="/assets/img/documentation/deploy.group.domain.png" alt="Groups" style="width:640px;height:360px;">
            </div>
          </div>
          <!-- NOTES -->
          <div class="tab-pane fade" id="notes-general" role="tabpanel">
            <h3 id="" class="page-header">General</h3>
            <div class="bs-docs-section">
              <p> The "Notes" feature allows you to write notes, bullet points, add images, and key words to a landing page, group, or domain. "Notes" can be formated like a simple word document. </p>
              <div class="bs-example">
                <img src="/assets/img/documentation/notes.png" alt="Notes" style="width:640px;height:360px;">
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="notes-uses" role="tabpanel">
            <h3 id="" class="page-header">Uses</h3>
            <div class="bs-docs-section">
              <p> · Make basic notes in paragraph or bullet form regarding your lander, group, or domain.
                <br>· Adding key words to the body of the note will allow the words to be searchable.
                <br>· Store images you'd like to add to the landing page.</p>
            </div>
          </div>
          <!-- TROUBLESHOOT -->
          <div class="tab-pane fade" id="troubleshoot-add-rip" role="tabpanel">
            <h3 id="" class="page-header">Troubleshoot Add and Rip</h3>
            <h2 id="text-contextuals">Why can't I add a landing page?</h2>
            <h3>Coming Soon! If you have questions, please contact <a href="mailto:lifen.sophia@buildcave.com?subject=Lander DS Inquiry">Leaf</a>.</h3>
            <p>
            </p>
          </div>
          <div class="tab-pane fade" id="troubleshoot-edit" role="tabpanel">
            <h3 id="" class="page-header">Troubleshoot Edit</h3>
            <h3>Coming Soon! If you have questions, please contact <a href="mailto:lifen.sophia@buildcave.com?subject=Lander DS Inquiry">Leaf</a>.</h3>
          </div>
          <div class="tab-pane fade" id="troubleshoot-delete" role="tabpanel">
            <h3 id="" class="page-header">Troubleshoot Delete</h3>
            <h3>Coming Soon! If you have questions, please contact <a href="mailto:lifen.sophia@buildcave.com?subject=Lander DS Inquiry">Leaf</a>.</h3>
          </div>
          <div class="tab-pane fade" id="troubleshoot-download" role="tabpanel">
            <h3 id="" class="page-header">Troubleshoot Download</h3>
            <h3>Coming Soon! If you have questions, please contact <a href="mailto:lifen.sophia@buildcave.com?subject=Lander DS Inquiry">Leaf</a>.</h3>
          </div>
          <div class="tab-pane fade" id="troubleshoot-other" role="tabpanel">
            <h3 id="" class="page-header">Troubleshoot Other</h3>
            <h3>Coming Soon! If you have questions, please contact <a href="mailto:lifen.sophia@buildcave.com?subject=Lander DS Inquiry">Leaf</a>.</h3>
          </div>
          <!-- RETURN TO TOP BUTTON -->
          <div style="margin-left: 300px" class="top-wrapper clearfix">
            <a href="#" class="return-top">Return to Top</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
