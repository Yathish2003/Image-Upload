require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});
db.once('open', () => {
  console.log('Database is connected...');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'my secret key',
  saveUninitialized: true,
  resave: false
}));

app.use((req, res, next) => {
  res.locals.message = req.session.message || '';
  delete req.session.message;
  next();
});


app.use(express.static('uploads'));

app.set('view engine', 'ejs');

app.use("", require("./routes/routes"));

app.listen(port, () => {
  console.log(`Server is started at http://localhost:${port}`);
});