FROM node:lts-alpine3.18
WORKDIR /smsform
COPY package*.json ./
RUN npm install
COPY ./public ./public
COPY ./src ./src
COPY ./ssl ./ssl
EXPOSE 3000
CMD ["npm", "start"]