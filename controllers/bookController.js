const Book = require("../models/book");
const mongoose = require("mongoose");
const path = require("path");
const formidable = require("formidable");

var fs = require("fs");

//methods


const book_index = (req, res) => {
  Book.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { books: result, title: "All books" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const book_details = (req, res) => {
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    Book.findById(id)
    .then((result) => {
             res.render("details", { book: result, title: "Book Details" });
      
    })
    .catch((err) => {
      console.log(err);
      res.render("404", { title: "Book not found" });
    });
  }
 
};

const book_create_get = (req, res) => {
  res.render("create", { title: "Create a new book" });
};

const book_create_post = (req, res)=> {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.file;
  uploadPath = path.join(__dirname , "../public/pdfs/",  sampleFile.name);
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);
    else{
      const newBook = new Book({
                title: req.body.title,
                snippet: req.body.snippet,
                file: sampleFile.name,

              })
              newBook.save()
              .then(result => {
                res.redirect('/books');
              })
              .catch(err => {
                console.log(err);
              });
    }
    }
  )};




const book_delete = (req, res) => {
  const id = req.params.id;
  Book.findByIdAndDelete(id)
    .then((result) => {
      fs.unlink(`${__dirname}/../public/pdfs/${result.file}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.json({ redirect: "/books" });
    })
    .catch((err) => {
      console.log(err);
    });
};



module.exports = {
  book_index,
  book_details,
  book_create_get,
  book_create_post,
  book_delete,
};
