const express = require('express');
const connectDB = require('./data/db');
const app = express();
const port = 5000;
const cors = require('cors');

// Connect to the database
connectDB();

// // Import routes
const postsRouter = require('./routes/posts');
const meshRouter = require('./routes/mesh');
const historyRouter = require('./routes/history');

app.use(cors());
// Use routes
app.use('/posts', postsRouter);
app.use('/mesh', meshRouter);
app.use('/history', historyRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
