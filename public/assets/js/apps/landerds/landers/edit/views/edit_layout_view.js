define(["app",
    "tpl!assets/js/apps/landerds/landers/edit/templates/edit_layout.tpl",
    "vendor/bower_installed/codemirror/lib/codemirror",
    "vendor/bower_installed/codemirror/mode/htmlmixed/htmlmixed",
    "vendor/bower_installed/codemirror/mode/css/css",
    "vendor/bower_installed/codemirror/mode/javascript/javascript",
    "fancytree",
    "bootstrap",
    "resizeReverse"
  ],
  function(Landerds, landersEditLayoutTemplate, CodeMirror) {

    Landerds.module("LandersApp.Landers.Edit", function(Edit, Landerds, Backbone, Marionette, $, _) {

      Edit.Layout = Marionette.LayoutView.extend({

        id: "edit-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: landersEditLayoutTemplate,

        regions: {

        },

        onRender: function() {
          var me = this;

          var codeMirror;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e){
          
            //resize width/height of modal to 80% of window
            var modalHeight = $( window ).height()*0.7;
            var modalWidth = $( window ).width()*0.8;

            me.$el.find('.edit-lander-modal-content').css('height', modalHeight);
            me.$el.find('.edit-lander-modal').css('width', modalWidth);

            // resize treeview to correct height/width of modal
            var fileListWidth = (modalWidth*0.1 > 200 ? modalWidth*0.1 : 200);
            var codePaneWidth = modalWidth - fileListWidth - 40;//- x is a margin
            me.$el.find('.file-list').css("width", fileListWidth);
            // resize codeview to correct height/width of modal
            me.$el.find('.code-pane').css("width", codePaneWidth); 

            var modalContentHeight = modalHeight - 30; //for padding
             me.$el.find('.file-list').css("height", modalContentHeight);
            // resize codeview to correct height/width of modal
            me.$el.find('.code-pane').css("height", modalContentHeight);
            //resizing code mirror has to be done after we render the element

            //max width is current width of (code pane + width of file list) - 200
            var maxResizeWidth = (fileListWidth + codePaneWidth) - 100;
            var minResizeWidth = 200;
            me.$el.find('.code-pane form').resizable({
              handles: 'w',
              alsoResizeReverse: ".edit-lander-container",
              maxWidth: maxResizeWidth,
              minWidth: minResizeWidth
            });
          });

          this.$el.on('shown.bs.modal', function(e) {

            codeMirror = CodeMirror.fromTextArea(me.$el.find("#code-area")[0], {
              lineNumbers: true,
              matchBrackets: true,
              // readOnly: "nocursor",
              mode: "htmlmixed"
            });
            //resize full height
            me.$el.find(".CodeMirror").css("height", me.$el.find('.file-list').css("height"));
            codeMirror.refresh();

            // Init FancyTree - w/Drag and Drop Functionality
            $("#tree6").fancytree({
              extensions: ["dnd"],
              
              dnd: {
                autoExpandMS: 400,
                focusOnClick: true,
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                dragStart: function(node, data) {
                  /** This function MUST be defined to enable dragging for the tree.
                   *  Return false to cancel dragging of node.
                   */
                  return true;
                },
                dragEnter: function(node, data) {
                  /** data.otherNode may be null for non-fancytree droppables.
                   *  Return false to disallow dropping on node. In this case
                   *  dragOver and dragLeave are not called.
                   *  Return 'over', 'before, or 'after' to force a hitMode.
                   *  Return ['before', 'after'] to restrict available hitModes.
                   *  Any other return value will calc the hitMode from the cursor position.
                   */
                  // Prevent dropping a parent below another parent (only sort
                  // nodes under the same parent)
                  /*           if(node.parent !== data.otherNode.parent){
                        return false;
                      }
                      // Don't allow dropping *over* a node (would create a child)
                      return ["before", "after"];
            */
                  return true;
                },
                dragDrop: function(node, data) {
                  /** This function MUST be defined to enable dropping of items on
                   *  the tree.
                   */
                  data.otherNode.moveTo(node, data.hitMode);
                }
              },
              activate: function(event, data) {
                //        alert("activate " + data.node);
              }
            });

          });

          this.$el.modal('show');

        },

        onClose: function() {
          this.$el.modal('hide');
        },

        onDomRefresh: function() {



        }
      });

    });
    return Landerds.LandersApp.Landers.Edit.Layout;
  });
