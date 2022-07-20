FROM node:lts-alpine

# Create docker image 

RUN mkdir /back
WORKDIR /back

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY src folder
COPY src ./src
RUN npm i -f
RUN npm i -g prisma
RUN npx prisma generate 

# A command to start the server
CMD npx prisma migrate dev --name init && prisma db push && npm start


