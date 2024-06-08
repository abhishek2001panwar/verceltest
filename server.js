const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes

app.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', { tasks });
});

// Show the form to create a new task
app.get('/tasks/new', (req, res) => {
    res.render('new');
});

// Handle the form submission to create a new task
app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({ title, description });
    await task.save();
    res.redirect('/');
});

// Show the form to edit an existing task
app.get('/tasks/:id/edit', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('edit', { task });
});

// Handle the form submission to update an existing task
app.post('/tasks/:id', async (req, res) => {
    const { title, description } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect('/');
});

// Handle the deletion of a task
app.post('/tasks/:id/delete', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
