const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const projectRouter = require('./routes/projectRoutes');
const userRouter = require('./routes/userRoutes');
const majorRouter = require('./routes/majorRoutes');
const taskRouter = require('./routes/taskRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const classRouter = require('./routes/classRoutes');
const app = express();

// Serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable passing of cookies and HTTP credentials
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,authorization'
  })
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 3) ROUTES
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/majors', majorRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/classes', classRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
