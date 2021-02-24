const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(cookieParser()); // Adding cookieParser() as application-wide middleware
app.use(express.urlencoded());
const csrfProtection = csrf({ cookie: true }); // creating csrfProtection middleware to use in specific routes

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];


app.get("/", (req, res) => {
  res.render('index', { users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('form', { title: "Create Normal User", csrfToken: req.csrfToken() });
});

const validateGuest = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push("Please fill out the first name field and upgrade to premium")
    }

  if (!lastName) {
    errors.push("Please fill out the last name field and upgrade to premium");
  }

  if (!email) {
    errors.push("Please fill out the email field and upgrade to premium");
  }

  if (!password) {
    errors.push("Please fill out the password field and upgrade to premium");
  }

  if (!confirmedPassword) {
    errors.push("Please fill out the confirm password field and upgrade to premium");
  }

  req.errors = errors;
  next();
};

app.post("/create", csrfProtection, validateGuest, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;

  if (req.errors.length > 0) {
    res.render("form", {
      title: "Create Normal User",
      errors: req.errors,
      firstName,
      lastName,
      email,
      password,
      confirmedPassword
    });
    return;
  }

    const normalUser = {
      firstName,
      lastName,
      email,
      password,
      confirmedPassword
    };
    users.push(normalUser);
    res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
