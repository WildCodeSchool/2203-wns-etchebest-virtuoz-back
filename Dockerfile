FROM node:lts-alpine

# Create docker image 

RUN mkdir /app
WORKDIR /app

# Copy all needed folder

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
COPY src src
COPY prisma prisma

# Expose on correct port 

EXPOSE 3000

# Run needed command 

RUN npm i -f
RUN npx prisma generate

# launch backend

CMD npm run dev