const mongoose = require('mongoose');

     const PostSchema = mongoose.Schema({
         title: {
             type: String,
             required: true
         },
         description: {
             type: String,
             required: true
         },
         author: {
             type: String,
             required: true
         },
         url: {
             type: String
         },
         tags: {
             type: [String]
         },
         likes: {
             type: Number
         },
         emojis: [{
             name: String 
         }],
         timestamp:{
            type: Date,
            default: Date.now
           },
           imageUrl: {
            type: String
        }

  
     });

     module.exports = mongoose.model('twitters', PostSchema);
