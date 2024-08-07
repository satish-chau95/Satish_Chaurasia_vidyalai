const express = require('express');
const axios = require('axios'); // Import Axios
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    // Use Promise.all to handle asynchronous operations within reduce
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        // Fetch photos for each post
        const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
        
        // Assuming the API returns an array of photos, map them to your desired format
        const images = response.data.map((photo) => ({
          url: photo.url,
        }));

        return {
          ...post,
          images, // Add fetched images to the post
        };
      })
    );

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts with images:', error);
    res.status(500).json({ error: 'An error occurred while fetching posts with images' });
  }
});

module.exports = router;
