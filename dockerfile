FROM node
WORKDIR /code
COPY package.json /code/package.json
RUN npm install
RUN npm install -g nodemon
EXPOSE 6969
CMD ["nodemon", "src/server.js"]