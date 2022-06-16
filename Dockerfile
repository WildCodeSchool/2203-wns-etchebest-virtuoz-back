FROM node:lts-alpine

# Create docker image 

RUN mkdir /app
WORKDIR /app

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .
RUN npm i -f
RUN npm i -g prisma1
RUN prisma 

# Run and expose the server on port 3000
EXPOSE 3000

# A command to start the server
CMD npm start