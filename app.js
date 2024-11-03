const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Book model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages: Number,
  published: Date,
});

const Book = mongoose.model('Book', bookSchema);

// Routes

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new book
app.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) return res.status(404).send('Book not found');
    res.json(updatedBook);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).send('Book not found');
    res.json(deletedBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

