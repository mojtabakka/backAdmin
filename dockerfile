
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

ENV DATABASE_USERNAME  "root"
ENV DATABASE_PASSWORD  '0019058101Aa@'
ENV DATABASE 'shop'
ENV DATABASE_PORT  3306
ENV DATABASE_HOST  46.249.101.115
ENV DATABASE_NAME mariadb

# Expose the port that NestJS listens on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]



