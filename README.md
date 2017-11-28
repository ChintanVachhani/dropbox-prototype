# dropbox-prototype

An individual effort to create a simple Dropbox replica. It uses NodeJS, ExpressJS, ReactJS, MongoDB and Apache Kafka.

## Git Repository

```
  git clone https://github.com/ChintanVachhani/dropbox-prototype.git
```

**Note : Please make sure your MongoDB, Zookeeper and Kafka are running.** Refer https://kafka.apache.org/quickstart for kafka setup. Use the createTopicsScript.bat for windows or createTopicsScript.sh for other OS to create the required topics on kafka. Instructions on where to put the scripts file to run are present in the file. Also `npm3` is required to install dependencies properly.

## Commands

1. Run the Node Server
   ```
   cd server
   cd node-server
   npm install
   npm run start
   ```
   - **Note :**
      - Server started @ 'localhost:8000'.
      
2. Run the Kafka Server
   ```
   cd server
   cd kafka-server
   npm install
   npm run start
   ```

3. Run the Client
   ```
   cd client
   npm install
   npm run start
   ```
   - **Note :** Client started @ 'localhost:3000'.
