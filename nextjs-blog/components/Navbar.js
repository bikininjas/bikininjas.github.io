import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogoClick = () => {
    router.push('/');
    setIsOpen(false);
  };

  const handleLinkClick = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <header className="navbar" ref={navRef}>
      <div className="logo" onClick={handleLogoClick}>
        <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
      </div>

      <button
        ref={buttonRef}
        className="menu-button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-label="toggle menu"
      >
        <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
      </button>

      <nav className={`nav-links ${isOpen ? 'show' : ''}`} role="navigation">
        <ul>
          <li className={router.pathname === '/' ? 'active' : ''}>
            <a onClick={() => handleLinkClick('/')}>Home</a>
          </li>
          <li className={router.pathname === '/blog' ? 'active' : ''}>
            <a onClick={() => handleLinkClick('/blog')}>Blog</a>
          </li>
          <li className={router.pathname === '/about' ? 'active' : ''}>
            <a onClick={() => handleLinkClick('/about')}>About</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
