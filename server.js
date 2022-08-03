const express = require("express");
const morgan = require("morgan");
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {requireAuth} = require('./middlweare/authMiddlewrare');
const bookController = require('./controllers/bookController');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI ="mongodb+srv://fouadae:0616087324fouad@cluster0.njjph.mongodb.net/med-books?retryWrites=true&w=majority";

// middleware & static files

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

const port = process.env.PORT || 3000  ;
const conn = mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false })
  .then((result) => app.listen(port))
  .catch((err) => console.log("err"));

// register view engine
app.set("view engine", "ejs");



// routes

app.get("/",  (req, res) => {
  res.redirect("/books");
});

app.get("/about",(req, res) => {
  res.render("about", { title: "About" });
});



// book routes
app.use("/books",bookRoutes.unprotected);
app.use("/books",requireAuth ,bookRoutes.protected);
app.use(authRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
