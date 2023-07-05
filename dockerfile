FROM node:centos
# RUN addgroup app && adduser -S -G app app
# USER app
WORKDIR /app/backend
COPY package.json .
RUN npm install
COPY . .
ENV  DATABASE_USERNAME = "root"
ENV DATABASE_PASSWORD='0019058101Aa@'
ENV DATABASE='test'
ENV DATABASE_PORT='3306'
ENV DATABASE_HOST="localhost"
ENV DATABASE_NAME="mysql"

