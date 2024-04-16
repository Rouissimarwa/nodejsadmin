const express = require("express");
const mongoose = require('mongoose');

const dotenv = require('dotenv');
const userRoute = require("./routes/user");
const productsRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");

const port = 3000;
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json({ limit: '10mb' }));

// Middleware to parse URL encoded requests
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/users', userRoute);
app.use('/api/products', productsRoute);
app.use('/api/order', orderRoute);
app.use('/api/cart', cartRoute);
app.use('/api/auth', authRoute);


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pfe')
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


// Start the server
app.listen(port, () => {
  console.log(`Le serveur écoute sur le port ${port}`);
});
