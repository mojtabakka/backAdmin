
# Use an official Node.js runtime as a parent image
FROM  --platform=linux/amd64  node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild native modules (like bcrypt)
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

ENV DATABASE_USERNAME = "root"
ENV DATABASE_PASSWORD='jffj@itih_123lkf'
ENV DATABASE='shop'
ENV DATABASE_PORT='3306'
ENV DATABASE_HOST="host.docker.internal"
ENV DATABASE_NAME="mysql"

# Expose the port that NestJS listens on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]



