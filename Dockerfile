FROM node:10.16.3
WORKDIR /usr/src/app
COPY package*.json ./
RUN ["npm", "install", "--production"]
COPY . .
EXPOSE 10010
CMD ["node", "app.js"]