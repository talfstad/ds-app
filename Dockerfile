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
RUN sudo apt-get install -y gzip

#Install java >= 1.5 for yuicompressor
RUN sudo apt-get -y install default-jre


# Install the app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm install

#fix the server date ?
#sudo ntpdate time.nist.gov

#start the app
EXPOSE 3000

CMD [ "node", "server/server.js"]