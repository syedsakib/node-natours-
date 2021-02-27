const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN....');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

//  ) CONNECT DATABASE:-
//----------------------
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(colors.inverse('DB connection successful...'));
  });

//console.log(process.env)
//console.log(process.env.NODE_ENV);

// ) RUN SERVER:-
//---------------
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(colors.inverse(`App running on port ${port}...`));
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNWANTED REJECTION! SHUTTING DOWN....');
  server.clean(() => {
    process.exit(1);
  });
});

//test
