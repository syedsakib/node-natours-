const express = require('express');
const morgn = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1 ) MIDDLEWARE:-
//----------------
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

//2 ) ROUTES:-
//------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//3 ) ERROR HANDELING:-
//------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//4 ) EXPORT APP:-
//----------------
module.exports = app;
