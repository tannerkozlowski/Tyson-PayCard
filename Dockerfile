FROM node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY . .
COPY package*.json ./

EXPOSE 3001

RUN npm install
CMD ["npm", "start"]
