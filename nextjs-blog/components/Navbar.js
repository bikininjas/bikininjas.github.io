import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll);
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
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo" onClick={handleLogoClick}>
        <Link href="/" role="link" aria-label="Your Site Name">
          <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
        </Link>
      </div>

      <button
        ref={buttonRef}
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        onKeyDown={handleKeyDown}
        aria-label="toggle menu"
      >
        <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
      </button>

      <nav 
        role="navigation" 
        className={`nav-links ${menuOpen ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`}
      >
        <ul>
          <li className={router.pathname === '/' ? 'active' : ''}>
            <Link 
              href="/" 
              role="link" 
              aria-current={router.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
          </li>
          <li className={router.pathname === '/blog' ? 'active' : ''}>
            <Link 
              href="/blog" 
              role="link" 
              aria-current={router.pathname === '/blog' ? 'page' : undefined}
            >
              Blog
            </Link>
          </li>
          <li className={router.pathname === '/about' ? 'active' : ''}>
            <Link 
              href="/about" 
              role="link" 
              aria-current={router.pathname === '/about' ? 'page' : undefined}
            >
              About
            </Link>
          </li>
        </ul>
        <div data-testid="theme-toggle">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

// Add the ThemeToggle component definition
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && darkModeMediaQuery.matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};
