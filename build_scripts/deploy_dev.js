/*

deploy_test.js - deploys a build to dev docker_machine

*/

var cmd = require('node-cmd');

//remove all containers and images
//docker stop $(docker ps -a -q)
//docker rm $(docker ps -a -q)
//docker rmi $(docker images -q)
//create dev docker image
cmd.get('docker stop $(docker ps -a -q)', function(data) {
  cmd.get('docker rm $(docker ps -a -q)', function(data) {
    cmd.get('docker rmi $(docker images -q)', function(data) {

      console.log("cleaned old dev environment");

      cmd.get('docker build -t test built', function(data) {

        console.log("built docker image");

        cmd.get('docker run -d -p 3000:3000 test', function(data) {
          console.log("app running on docker-machine port 3000");
        });
      });
    });
  });
});
