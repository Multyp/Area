FROM node:18

WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.json ./

COPY .env .env

RUN npm install

COPY ./src ./src

RUN npm run build

CMD [ "npm", "run", "dev" ]
