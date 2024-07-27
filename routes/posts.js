const express = require('express');
     const router = express.Router();
     const Post = require('../models/twitter');
     const multer = require('multer');
    
        
     
     const redis = require('redis');
     const client = redis.createClient();
     
     client.on('error', (err) => console.error('Redis Client Error', err));
     client.connect();
     
     // Middleware to check cache
     const checkCache = async (req, res, next) => {
         const { id } = req.params;
         try {
             const data = await client.get(id);
             if (data) {
                 return res.json(JSON.parse(data));
             }
             next();
         } catch (err) {
             console.error(err);
             next();
         }
     };
     
     // Get post by ID with caching
     router.get('/:id', checkCache, async (req, res) => {
         try {
             const post = await Post.findById(req.params.id);
             if (post) {
                 await client.set(req.params.id, JSON.stringify(post));
                 res.json(post);
             } else {
                 res.status(404).json({ message: 'Post not found' });
             }
         } catch (err) {
             res.status(500).json({ message: err.message });
         }
     });
     
        

 // Create a new post
 router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        url: req.body.url,
        tags: req.body.tags,
        likes: req.body.likes,
        emojis: req.body.emojis

    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});  




// Configure Multer
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create a new post
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            imageUrl: req.file.path
        });
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


     // Delete a post
     router.delete('/:postId', async (req, res) => {
         try {
             const removedPost = await Post.deleteOne({ _id: req.params.postId });
             if (removedPost.deletedCount === 0) {
                 return res.status(404).json({ message: 'Post not found' });
             }
             res.json({ message: 'Post deleted successfully' });
         } catch (err) {
             res.status(500).json({ message: err.message });
         }
     });

     // Update a post
     router.patch('/:postId', async (req, res) => {
         try {
             const updatedPost = await Post.updateOne(
                 { _id: req.params.postId },
                 { $set: { title: req.body.title } }
             );
             if (updatedPost.modifiedCount === 0) {
                 return res.status(404).json({ message: 'Post not found or no changes made' });
             }
             res.json(updatedPost);
         } catch (err) {
             res.status(500).json({ message: err.message });
         }
     });


     /*// Get a specific post
      router.get('/:postId', async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(post);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }); */

 /*   // Get all posts with pagination (index route)
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    try {
        const posts = await Post.find()
                                .sort({ _id: 1 })
                                .limit(limit)
                                .skip(skipIndex);
        const totalPosts = await Post.countDocuments();

        res.json({
            page,
            limit,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}); */


 //Get all posts
 router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}); 

     module.exports = router;
