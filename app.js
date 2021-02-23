const express = require('express');
const morgn = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1 ) MIDDLEWARE:
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log('Hello from middleware function...');
    next();
  });
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log('Requested at:', req.requestTime);
    next();
  });
  app.use(morgn('dev'));
}

//2 ) ROUTES:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//3 ) RUN SERVER:
module.exports = app;
