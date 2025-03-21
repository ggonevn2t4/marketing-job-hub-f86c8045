
import React from 'react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  requireAuth?: boolean;
}

const Layout = ({ children, hideFooter = false, requireAuth = false }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
