const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
});
app.use(bodyParser.json());
app.use(cookieParser());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use((req, res) => {
  res.status(404);
  res.send({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
