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

# COPY
COPY . .
RUN npm i -f
RUN npx prisma generate 

# A command to start the server
CMD npm start