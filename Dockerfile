FROM ubuntu:14.04
MAINTAINER Trevor Alfstad "trevor@buildcave.com"

# Update packages
RUN apt-get update -y && apt-get upgrade -y

# Install some packages we need
RUN apt-get install -y curl

# Install latest version of pip
#RUN curl -O https://bootstrap.pypa.io/get-pip.py && python get-pip.py

# Install Node.JS latest
RUN cd /usr/local && curl http://nodejs.org/dist/latest-argon/node-v4.2.6-linux-x64.tar.gz | tar --strip-components=1 -zxf- && cd
RUN npm -g update npm


# Install the app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

RUN npm install

#install bower
RUN npm install bower -g
RUN bower install



#start the app
EXPOSE 3000
CMD [ "node", "./server/server.js"]