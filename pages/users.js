import React from 'react';
// import Carousel from '../components/CarouselUI';
import Footer from '../components/Footer';
import TopNavbar from '../components/Navbar';
import UserList from '../components/UserList';

export default function HomePage() {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <TopNavbar />
      <div
        style={{
          margin: '60px 0px 20px',
        }}
      > 
        {/* <Carousel /> */}
        <UserList />
      </div>
      <Footer />
    </div>
  );
}
