const express = require('express');
const morgn = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//1 ) MIDDLEWARE:-
//----------------
//Set security HTTP headers
app.use(helmet());

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, plase try again in an hour',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json());

//Data sanitaization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitaization against XSS
app.use(xss());

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
app.use('/api/v1/reviews', reviewRouter);

//3 ) ERROR HANDELING:-
//------------
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//4 ) EXPORT APP:-
//----------------
module.exports = app;
