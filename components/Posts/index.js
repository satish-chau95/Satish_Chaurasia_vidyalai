import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

// ... previous code ...

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0); // new state to track starting point
  const [hasMorePosts, setHasMorePosts] = useState(true); // new state to check if there are more posts

  const { isSmallerDevice } = useWindowWidth();

  const fetchPost = async (start) => {
    const { data: fetchedPosts } = await axios.get('/api/v1/posts', {
      params: { start, limit: isSmallerDevice ? 5 : 10 },
    });

    if (fetchedPosts.length < (isSmallerDevice ? 5 : 10)) {
      setHasMorePosts(false); // no more posts to load
    }

    setPosts(prevPosts => [...prevPosts, ...fetchedPosts]); // append new posts
  };

  useEffect(() => {
    fetchPost(0); // fetch initial posts
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);
    const newStart = start + (isSmallerDevice ? 5 : 10); // calculate new start index
    fetchPost(newStart).then(() => {
      setStart(newStart); // update start index
      setIsLoading(false);
    });
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post, index) => (
          <Post key={index} post={post} /> // add key to prevent warnings
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMorePosts && ( // hide button if no more posts
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}
