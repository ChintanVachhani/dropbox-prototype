let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require('cors');

// Initialize the Express App
let app = express();

// Import required modules
let serverConfig = require('./config');
let userRoutes = require('./routes/user');
let directoryRoutes = require('./routes/directory');
let fileRoutes = require('./routes/file');
let sharedDirectoryRoutes = require('./routes/sharedDirectory');
let sharedFileRoutes = require('./routes/sharedFile');
let activityRoutes = require('./routes/activity');
let groupRoutes = require('./routes/group');
let groupFileRoutes = require('./routes/groupFile');

// CORS settings
let corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));
app.use(cookieParser());

// API paths
app.use('/user', userRoutes);
app.use('/directory', directoryRoutes);
app.use('/file', fileRoutes);
app.use('/sharedDirectory', sharedDirectoryRoutes);
app.use('/sharedFile', sharedFileRoutes);
app.use('/activity', activityRoutes);
app.use('/group', groupRoutes);
app.use('/groupFile', groupFileRoutes);

// catch 404 and render index page
app.use(function (req, res, next) {
  res.status(404).json({
    title: 'Bad API call.',
    error: {message: 'Page not found.'},
  });
});

// start app
app.listen(serverConfig.port, (error) => {
    if (!error) {
        console.log(`dropbox-prototype is running on port: ${serverConfig.port}!`);
    }
});

module.exports = app;
