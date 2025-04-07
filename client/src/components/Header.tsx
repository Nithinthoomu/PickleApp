"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link component
import { FaBars } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='sample'>
      <nav>
        <h1 className='app-title'>Pickles APP</h1>
        {isMobile && (
          <div className='menu-toggle' onClick={toggleMenu}>
            <FaBars size={24} /> {/* Use the menu icon */}
          </div>
        )}
        <ul className={`list-components-header ${isMenuOpen ? 'open' : ''}`}>
          <li className='navbar-components'>
            <Link href="/">Home</Link>
          </li>
          <li className='navbar-components'>
            <Link href="/register">Register</Link>
          </li>
          <li className='navbar-components'>
            <Link href="/signin">Signin</Link>
          </li>
          <li className='navbar-components'>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;