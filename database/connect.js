const mongoose = require('mongoose');

const dbString = process.env.DATABASE_URI
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