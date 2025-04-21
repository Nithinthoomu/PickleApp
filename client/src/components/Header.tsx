"use client";

import React, { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaUserCircle, FaSignOutAlt, FaEdit, FaShoppingCart } from 'react-icons/fa';
import { AuthContext } from '@/context/AuthContext';
import { CartContext } from '@/context/CartContext';
import EditProfileModal from '../components/EditProfileModal';
import '../styles/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const profileRef = useRef<HTMLLIElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsMenuOpen(false);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="header-main">
      <nav>
        <h1 className="app-title">Pickles APP</h1>
        {isMobile && (
          <div className="menu-toggle" onClick={toggleMenu}>
            <FaBars size={24} />
          </div>
        )}
        <ul className={`list-components-header ${isMenuOpen ? 'open' : ''}`}>
          <li className="navbar-components">
            <Link href="/">Home</Link>
          </li>
          {!user && (
            <li className="navbar-components">
              <Link href="/register">Register</Link>
            </li>
          )}
          {!user && (
            <li className="navbar-components">
              <Link href="/signin">Signin</Link>
            </li>
          )}
          <li className="navbar-components">
            <Link href="/about">About</Link>
          </li>
          {user && (
            <li className="navbar-components">
              <Link href="/cart" className='cart-icon-container'>
                <FaShoppingCart size={24} />
                {cart.length > 0 && <span className="cart-length">{cart.length}</span>}
              </Link>
            </li>
          )}
          {user && (
            <li className="navbar-components profile" ref={profileRef}>
              <FaUserCircle size={24} onClick={toggleProfile} />
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <div className="profile-edit-option" onClick={() => setIsEditProfileOpen(true)}>
                    <FaEdit size={16} />
                    <span>Edit Profile</span>
                  </div>

                  <div className="user-orders">
                    <Link href="/orders" className="profile-edit-option">
                      <span>My Orders</span>
                    </Link>
                  </div>

                  <div className="logout-option" onClick={logout}>
                    <FaSignOutAlt size={16} />
                    <span>LogOut</span>
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
      {isEditProfileOpen && <EditProfileModal onClose={() => setIsEditProfileOpen(false)} />}
    </div>
  );
}

export default Header;