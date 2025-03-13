
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  withFilters?: boolean;
  requireAuth?: boolean;
  redirect?: string;
}

const Layout = ({ 
  children, 
  withFilters = false, 
  requireAuth = false,
  redirect = '/auth'
}: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { user, isLoading } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check authentication when requireAuth is true
  useEffect(() => {
    if (requireAuth && !isLoading && !user) {
      navigate(redirect);
    }
  }, [requireAuth, user, isLoading, navigate, redirect]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${isMobile ? 'pt-16' : isTablet ? 'pt-18' : 'pt-20'} ${withFilters ? 'pb-24' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
