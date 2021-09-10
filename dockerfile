FROM node
WORKDIR /code
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY package.json /code/package.json
RUN npm install
RUN npm install -g nodemon
EXPOSE 6868
EXPOSE 587
CMD ["nodemon", "src/server.js"]
# CMD ["nodemon", "src/notifications/mailer.js"]
