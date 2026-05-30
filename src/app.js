require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes/index');

const app = express();

connectDB();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));