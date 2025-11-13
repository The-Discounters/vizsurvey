# Use the slim version of the node 14 image as our base
FROM node:22.11.0

# Create a directory for our application in the container 
RUN mkdir -p /vizsurvey

# Set this new directory as our working directory for subsequent instructions
WORKDIR /vizsurvey

# Copy all files in the current directory into the container
COPY . .

# Install dependencies
RUN yarn workspaces focus --production
#RUN yarn install --immutable
RUN yarn install

# Build the SPA
RUN yarn build:app

# Expose the port your SPA runs on
EXPOSE 3000
#EXPOSE 443

# Start the application
CMD ["yarn", "start:app:prod"] 