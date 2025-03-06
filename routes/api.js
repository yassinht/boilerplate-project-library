'use strict';
const Book = require('../models/book');

module.exports = function (app) {

  // POST /api/books to create a new book
  app.route('/api/books')
    .get(async (req, res) => {
      try {
        let books = await Book.find();

        // Transform books to include commentcount
        let booksWithCommentCount = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments ? book.comments.length : 0 // Add commentcount
        }));

        res.json(booksWithCommentCount);
      } catch (err) {
        console.error(err);
        res.status(500).json('error fetching books');
      }
    })

    .post((req, res) => {
      if (req.body.title === "") return res.json('missing required field title');

      // Initialize the comments array and commentcount if they are not present
      let book = new Book(req.body);
      book.comments = book.comments || [];  // Ensure comments is initialized as an empty array
      book.commentcount = book.comments.length; // Initialize commentcount to the length of the comments array

      book.save().then(doc => {
        res.json({
          _id: doc._id,
          title: doc.title,
          comments: doc.comments,
          commentcount: doc.commentcount
        });
      }).catch(err => {
        res.json('missing required field title');
      });
    })

    .delete(async (req, res) => {
      try {
        const result = await Book.deleteMany(); // Deletes all books
        res.json('complete delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).json('error deleting books');
      }
    });

  // GET /api/books/:id to get a specific book by ID
  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      try {
        let b = await Book.findById(bookid);
        if (b) {
          res.json({ _id: b._id, title: b.title, comments: b.comments ? b.comments : [] });
        } else {
          res.json('no book exists');
        }
      } catch (err) {
        res.json('no book exists');
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (comment) {
        try {
          let b = await Book.findById(bookid);
          if (b) {
            b.comments = b.comments || []; // Ensure comments array is initialized
            b.comments.push(comment);
            b.commentcount = b.comments.length; // Update commentcount
            await b.save();
            res.json({ _id: b._id, title: b.title, comments: b.comments, commentcount: b.commentcount });
          } else {
            res.json('no book exists');
          }
        } catch (err) {
          res.json('no book exists');
        }
      } else {
        res.json('missing required field comment');
      }
    })

    .delete(async (req, res) => {
      try {
        let b = await Book.findByIdAndRemove(req.params.id);
        if (b) {
          res.json('delete successful');
        } else {
          res.json('no book exists');
        }
      } catch (err) {
        res.json('no book exists');
      }
    });
};
