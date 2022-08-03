const express = require("express");

const bookController = require("../controllers/bookController");



const routerPublic = express.Router();
const routerProtected = express.Router();


routerPublic.get("/create", bookController.book_create_get);
routerPublic.get("/", bookController.book_index);
routerProtected.post("/",bookController.book_create_post);
routerPublic.get("/:id", bookController.book_details);
routerProtected.delete("/:id", bookController.book_delete);

module.exports = 
{   protected:routerProtected,
    unprotected:routerPublic
};
