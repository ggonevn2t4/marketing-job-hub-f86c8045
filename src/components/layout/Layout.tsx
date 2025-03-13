
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

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
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check authentication when requireAuth is true
  useEffect(() => {
    if (requireAuth && !isLoading) {
      if (!user) {
        navigate(redirect);
      } else {
        setIsFirstLoad(false);
      }
    } else {
      setIsFirstLoad(false);
    }
  }, [requireAuth, user, isLoading, navigate, redirect]);

  // Show loading screen on first load if authentication check is in progress
  if (requireAuth && isFirstLoad) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p>Đang kiểm tra xác thực...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
