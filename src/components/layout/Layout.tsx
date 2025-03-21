
import React from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  requireAuth?: boolean;
}

const Layout = ({ children, hideFooter = false, requireAuth = false }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {isMobile && <div className="h-16"></div>} {/* Spacer for mobile nav */}
      {!hideFooter && <Footer />}
      {isMobile && <MobileNav />}
    </div>
  );
};

export default Layout;
