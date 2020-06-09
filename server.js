// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const shortid = require("shortid");
const db = require("./db");

const userRoutes = require("./routes/user.route");
const bookRoutes = require("./routes/book.route");
const transactionRoutes = require("./routes/transaction.route");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/transactions", transactionRoutes);

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  // response.sendFile(__dirname + "/views/index.html");
  response.render('index');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
