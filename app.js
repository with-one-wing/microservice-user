const express = require('express');
const util = require('util');
const cors = require('cors');

const app = express();
const userRoutes = require('./api/routes/user');

const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(cors());
app.use('/uploads/', express.static('uploads'));

require('./db');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log('USERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSERUSER', req);

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', '*');
        res.status(200).json({});

    }
    next();
});

app.use('/api/v1/users', userRoutes);

app.use('/static', express.static('public'));

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});


console.log('xxxfoooofff', util.inspect(app.route('/').__proto__.__proto__));

app.use((error, req, res, next) => {
    console.log('', error);
    next(error);
});

app.use((error, req, res, next) => {
    console.log('error', error);
    res.status(req.status || 500);
    res.json({
        error: {
            message: error.message,
            status: req.status,
            description: "Uncatchable Error"
        }
    });
});

module.exports =  app;