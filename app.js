const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const adminRouter = require('./routes/admin.router');
const adminCanRouter = require('./routes/adminCan.router');
const userRouter = require('./routes/user.router');

dotenv.config();
const server = express();
server.use(bodyParser.json());
server.listen(8000, () => {
  console.log('server is running');
});
server.use('/admin', adminRouter);
server.use('/admin', adminCanRouter);
server.use('/user', userRouter);
