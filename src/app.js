const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json()); // parsing json body
app.use(express.urlencoded({ extended: true })); //parsing url form data

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // show logs in dev mode
}


app.use('/api', require('./routes')); // using all routes under /api


app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});


app.use((err, req, res, next) => {  // global error handler
  console.error('Global Error Handler:', err); 
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ error: message });
});

module.exports = app;
