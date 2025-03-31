import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Navbar({ title }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          {title}
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link href="/" className="navbar-link">
              Accueil
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/posts/unreal-engine-beginners-guide" className="navbar-link">
              Blog
            </Link>
          </li>
          <li className="navbar-item">
            <a 
              href="https://github.com/bikininjas/bikininjas.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="navbar-link"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired
};
