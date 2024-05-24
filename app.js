require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express();
const port = process.env.PORT || 8080;


// Create MySQL connection
const connection = mysql.createConnection({
 host: process.env.MYSQL_HOST,
 user: process.env.MYSQL_USER,
 password: process.env.MYSQL_PASSWORD,
 database: process.env.MYSQL_DATABASE
});


connection.connect((err) => {
 if (err) throw err;
 console.log('Connected to MySQL database');
});


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
 const query = 'SELECT t.id, t.text, u.username FROM todos t JOIN users u ON t.user_id = u.id';
 connection.query(query, (err, todos) => {
   if (err) throw err;
   res.render('index', { todos });
 });
});


app.post('/add', (req, res) => {
 const userId = /* get the user ID from the request or session */;
 const text = req.body.text;
 const query = 'INSERT INTO todos (user_id, text) VALUES (?, ?)';
 connection.query(query, [userId, text], (err, result) => {
   if (err) throw err;
   res.redirect('/');
 });
});


app.post('/delete', (req, res) => {
 const todoId = req.body.id;
 const query = 'DELETE FROM todos WHERE id = ?';
 connection.query(query, [todoId], (err, result) => {
   if (err) throw err;
   res.redirect('/');
 });
});


app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});
