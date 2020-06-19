// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config()
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const authMiddleware = require('./middlewares/auth.middleware');

const userRoutes = require("./routes/user.route");
const bookRoutes = require("./routes/book.route");
const transactionRoutes = require("./routes/transaction.route");
const authRoutes = require("./routes/auth.route");
const profileRoutes = require("./routes/profile.route");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('pvtkynz'));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use("/users", authMiddleware.requireAuth, userRoutes);
app.use("/books", authMiddleware.requireAuth, bookRoutes);
app.use("/transactions", authMiddleware.requireAuth, transactionRoutes);
app.use("/auth", authRoutes);
app.use('/profile', authMiddleware.requireAuth, profileRoutes);


// const bcrypt = require('bcrypt');
// bcrypt.hash('123123',10,function(err,hash){
//   console.log(hash )
// });

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", authMiddleware.requireAuth, (req, res) => {
  // response.sendFile(__dirname + "/views/index.html");

  if (req.cookies.count) {
    let count = parseInt(req.cookies.count);
    console.log(count);
    res.cookie("count", count + 1);
  } else res.cookie("count", 1);
  res.render("index");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
