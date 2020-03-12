FROM node:13
COPY . /home/node/server
RUN rm -rf node_modules
WORKDIR /home/node/server
RUN npm install
CMD node server.js
EXPOSE 9001