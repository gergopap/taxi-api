FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN ["npm", "install", "--production"]
COPY . .
EXPOSE 10010
CMD ["node", "app.js"]