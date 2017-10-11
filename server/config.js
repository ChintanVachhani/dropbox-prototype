import path from 'path';

const config = {
  port: process.env.PORT || 8000,
  server: 'localhost',
  database: {
    name: 'dropbox-prototype',
    username: 'root',
    password: 'root',
  },
  box:{
    path: path.resolve(__dirname, '../box')
  }
};

export default config;
