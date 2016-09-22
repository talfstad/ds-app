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

#image compression
RUN sudo apt-get install -y libjpeg-progs #jpegtran
RUN sudo apt-get install -y gifsicle #gifsicle
RUN sudo apt-get install -y pngcrush #pngcrush
RUN sudo apt-get install -y optipng #png optimize

#Install java >= 1.5 for yuicompressor
#RUN sudo apt-get install -y default-jre


# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm install phantomjs -g && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

# Bundle app source
ADD . /opt/app

WORKDIR /opt/app/server

#start the app
EXPOSE 3000

CMD ["node", "./server.js"]
