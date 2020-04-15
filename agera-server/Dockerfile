# Use the official image as a parent image.
FROM node:latest

# Set the working directory.
WORKDIR /usr/src/app

ARG NPM_TOKEN
ARG npmrc  
RUN echo "$npmrc" > ~/.npmrc

# Copy the file from your host to your current location.
COPY package.json .

# Run the command inside your image filesystem.
RUN npm install
RUN rm ~/.npmrc

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 4443

# Run the specified command within the container.
CMD [ "npm", "start" ]

# Copy the rest of your app's source code from your host to your image filesystem.
COPY *.pem ./
COPY outDir ./outDir
COPY web ./web
