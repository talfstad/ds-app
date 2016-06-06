
####create landerds test environment:
eb create --cfg test-env-sc landerds-test

#####deploy latest commit to test:
eb deploy landerds-test





//get logs
eb logs

//eb deploy --staged landerds-test // deploy the staged version not checked in version




//docker image comands

docker build -t test .
docker run test
