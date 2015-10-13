/*
    Undeploy worker module is responsible for:

    1. 

*/

module.exports = function() {

    var module = {};
    
    module.undeploy = function(domainModelAttributes, hasSuccessfullyStartedCallback) {
       //1. add job to table using server id, lander id, domain id, action, processing

       //2. call the successfullystarted callback

       //4. on success update the jobs table
       //done
       var model = {"ok":"okoktest"};
       hasSuccessfullyStartedCallback(model);


       //3. now undeploy the lander from the domain
       //       - call aws to remove the lander


    };

    return module;

}            