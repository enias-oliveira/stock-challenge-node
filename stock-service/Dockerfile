# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

ENV NODE_ENV production

# Install app dependencies
RUN npm ci

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "npm", "run", "start:migrate:prod" ]
