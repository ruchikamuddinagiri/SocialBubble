const mongoose = require('mongoose');

const dbString = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/socialbubble'
const db = () => {
  console.log(dbString)
  return mongoose
    .connect(dbString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((connection) => console.log('Connected to Database'))
    .catch((exception) => console.log('DB Error: ' + exception.message));
};

module.exports = db;