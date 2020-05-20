// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const formatStr = require("./functions/format-str"); // search k phân biệt có dấu hay không

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var todos = ["Đi chợ", "Nấu cơm", "Rửa bát", "Học code tại CodersX"];

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("I love CodersX");
});

app.get("/todos", function(req, res) {
  let q = req.query.q;
  let data =
    !q || q === ""
      ? todos
      : todos.filter(i => {
          return formatStr(i).indexOf(formatStr(q)) > -1;
        });
  res.render("index", { todos: data, old: q });
});

app.post("/todos/create", function(req, res) {
  let todo = req.body.todo.trim();
  if (todo !== "") todos.push(req.body.todo);
  res.redirect("back");
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
