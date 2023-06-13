const cors = require('cors');

const corsMiddleware = cors({
  origin: '*', // allow requests from all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // allow these HTTP methods
});

module.exports = corsMiddleware;