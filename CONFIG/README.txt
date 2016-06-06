deployments are done like this:


`npm run dev` -- runs development environment on the docker machine. if the default docker-machine is not running run:
`docker-machine start default`

`npm run test` -- builds and deploys code to test elastic beanstalk "test.landerds.com"

`npm run prod` -- builds and deploys code to production "panel.landerds.com"



