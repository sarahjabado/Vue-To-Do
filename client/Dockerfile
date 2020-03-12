FROM node:13
COPY . /home/node/client
RUN rm -rf node_modules
WORKDIR /home/node/client
RUN npm install --verbose
RUN npm uninstall node-sass && npm install node-sass --sass-binary-name=linux-x64-79
RUN npm rebuild node-sass
RUN npm install -g @vue/cli
WORKDIR /home/node/client/node_modules/node-sass/vendor/
RUN mkdir linux-x64-79
RUN wget -c https://github.com/sass/node-sass/releases/download/v4.13.1/linux-x64-79_binding.node -O linux-x64-79/binding.node
WORKDIR /home/node/client
CMD npx vue-cli-service serve
EXPOSE 9000