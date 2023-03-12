FROM node
WORKDIR /app
COPY package*.json ./

RUN npm install

#RUN apt-get install -y sqlite3 libsqlite3-dev

CMD ["npm","run","dev"]