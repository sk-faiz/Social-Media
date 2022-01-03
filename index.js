const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/user');
const Userauth = require('./routes/auth');
const bodyParser = require('body-parser');
const postRoute = require('./routes/post');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('combined'))
app.use(helmet())

app.use('/api/user', userRoute);
app.use('/api/auth', Userauth);
app.use('/api/post', postRoute);

app.listen(4000, () => {console.log("back-end server running")})