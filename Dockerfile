FROM ubuntu:14.04
MAINTAINER Trevor Alfstad "trevor@buildcave.com"

# Update packages
RUN apt-get update -y
RUN apt-get upgrade -y

# Install some packages we need
RUN apt-get install -y curl

#Install Node.JS latest 4.x version
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

#phantomJS libfont dependency
RUN sudo apt-get install -y libfontconfig

#image optimization
RUN sudo apt-get install -y libpng-dev

#gzip for gzip dependency
RUN sudo apt-get install -y gzip

#Install java >= 1.5 for yuicompressor
RUN sudo apt-get install -y default-jre

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app

# Bundle app source
ADD . /opt/app

#start the app
EXPOSE 3000

CMD [ "node", "./server/server.js"]