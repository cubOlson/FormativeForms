const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(cookieParser()); // Adding cookieParser() as application-wide middleware
app.use(express.urlencoded());
const csrfProtection = csrf({ cookie: true }); // creating csrfProtection middleware to use in specific routes


app.get("/", (req, res) => {
  res.render('index', { users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('form', { title: "Create Normal User", csrfToken: req.csrfToken() });
});

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
