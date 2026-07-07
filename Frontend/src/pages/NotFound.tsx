import { Link } from 'react-router-dom';
import { Search, Home } from 'lucide-react';
import { Header, Footer, Button } from '../components';

export const NotFound = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center">
        <div className="container-x text-center">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-primary-600 mb-4">404</h1>
            <p className="text-4xl font-bold text-secondary-900 mb-4">Page Not Found</p>
            <p className="text-lg text-secondary-600 mb-8">
              Sorry, the page you're looking for doesn't exist.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" size="lg">
                <Home size={20} /> Go Home
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                <Search size={20} /> Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
