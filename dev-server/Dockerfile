FROM node:18

WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.json ./

COPY ./.developers.json ./

RUN npm install

COPY ./src ./src

RUN npm run build

EXPOSE 8083

CMD [ "npm", "run", "start" ]
