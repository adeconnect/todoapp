require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'MONGO_DB_URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.render('index', { todos: todos });
});

app.post('/add', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  await todo.save();
  res.redirect('/');
});

app.post('/delete', async (req, res) => {
  await Todo.findByIdAndRemove(req.body.id);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
