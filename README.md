# dropbox-prototype

An individual effort to create a simple Dropbox replica. It uses NodeJS, ExpressJS, ReactJS, MongoDB and Apache Kafka.

## Git Repository

```
  git clone https://github.com/ChintanVachhani/dropbox-prototype.git
```

**Note : Please make sure your MongoDB is running.** Also `npm3` is required to install dependencies properly.

## Commands

####1. Run the Node Server
   ```
   cd server
   cd node-server
   npm install
   npm run start
   ```
   - **Note :**
      - Server started @ 'localhost:8000'.
      
####2. Run the Kafka Server
   ```
   cd server
   cd kafka-server
   npm install
   npm run start
   ```

####3. Run the Client
   ```
   cd client
   npm install
   npm run start
   ```
   - **Note :** Client started @ 'localhost:3000'.
