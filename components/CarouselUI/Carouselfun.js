// src/Carousel.js

import React, { useState, useEffect } from 'react';
import './Carouselstyle.css';

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/v1/posts');
        const data = await response.json();
        setImages(data.slice(0, 5)); // Limiting to 5 images for carousel
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) return <p>Loading...</p>;

  return (
    <div className="carousel">
      <button className="nav-button prev" onClick={goToPrevSlide} aria-label="Previous slide">
        ‹
      </button>
      <div className="carousel-track-container">
        <ul className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <li className={`carousel-slide ${index === currentIndex ? 'current-slide' : ''}`} key={image.id}>
              <img src={image.url} alt={image.title} />
            </li>
          ))}
        </ul>
      </div>
      <button className="nav-button next" onClick={goToNextSlide} aria-label="Next slide">
        ›
      </button>
    </div>
  );
};

export default Carousel;
