// models/book.js
const mongoose = require('mongoose');

// Define Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

// Define the model based on the schema
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
