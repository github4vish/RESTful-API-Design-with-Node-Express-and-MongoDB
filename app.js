const express = require('express');
     const mongoose = require('mongoose');
     const app = express();
     const postsRoute = require('./routes/posts');

     // Middleware
     app.use(express.json());
     app.use('/posts', postsRoute);

    
     // Connect to MongoDB using then and catch
     mongoose.connect('mongodb://localhost:27017/restful_api')
     .then(() => {
         console.log('Connected to DB!');

         // Start listening on port 3000
         app.listen(3000, () => {
             console.log('Server is running on port 3000');
         });
     })
     .catch((error) => {
         console.error('Failed to connect to MongoDB', error);
     });

