FROM ubuntu:14.04
MAINTAINER Trevor Alfstad "trevor@buildcave.com"

# Update packages
RUN sudo apt-get update -y
RUN sudo apt-get upgrade -y

# Install some packages we need
RUN apt-get install -y curl

#Install Node.JS latest 4.x version
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

#phantomJS libfont dependency
RUN sudo apt-get install -y libfontconfig

#gzip for gzip dependency
RUN sudo apt-get install -y gzip
RUN sudo apt-get install -y unzip

#git is a dependency for the npm install. not sure which package uses it but its @annoying
RUN sudo apt-get install -y git

#for installing packages
RUN sudo apt-get install -y checkinstall

#image compression
RUN sudo apt-get install -y libjpeg-progs #jpegtran
RUN sudo apt-get install -y gifsicle #gifsicle
RUN sudo apt-get install -y pngcrush #pngcrush
RUN sudo npm install phantomjs -g

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json

RUN cd /tmp && npm install

RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# Bundle app source
ADD . /opt/app

#optipng 0.7.6
RUN cd /opt/app && tar xvf optipng-0.7.6.tar.gz
RUN cd /opt/app/optipng-0.7.6 && ./configure && make && checkinstall -y

# npm install the custom modules
RUN cd /opt/app/node_modules_custom/website-scraper && npm install

WORKDIR /opt/app/server

#start the app
EXPOSE 3000

CMD ["node", "./server.js"]
