
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
  withFilters?: boolean;
}

const Layout = ({ children, withFilters = false }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
