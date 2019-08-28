FROM node:latest
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 10010
CMD [ "node", "app.js" ]