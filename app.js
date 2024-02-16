const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const adminRouter = require('./routes/admin.router');
const userRouter = require('./routes/user.router');
const imgRouter = require('./routes/img.router');

dotenv.config();
const server = express();
server.use(bodyParser.json());
const options = {
  definition: {
    openapi: '3.0.0',
    servers: [
      {
        url: 'http://localhost:8000/',
      },
    ],
  },
  apis: ['./routes/*swagger.js'],
};
const spacs = swaggerjsdoc(options);
server.use('/api-doc', swaggerui.serve, swaggerui.setup(spacs));
server.listen(8000, () => {
  console.log('server is running');
});
server.use('/admin', adminRouter);
server.use('/user', userRouter);
server.use('/img', imgRouter);

// set page not found
server.use('*', (req, res) => {
  res.send('Page Not Found ');
});
