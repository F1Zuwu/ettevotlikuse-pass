const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);