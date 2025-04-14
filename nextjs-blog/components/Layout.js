import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div data-testid="layout" className="layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;