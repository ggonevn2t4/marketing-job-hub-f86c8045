
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Building, User, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  const navItems = [
    {
      name: 'Trang chủ',
      path: '/',
      icon: <Home size={20} />,
    },
    {
      name: 'Việc làm',
      path: '/jobs',
      icon: <Briefcase size={20} />,
    },
    {
      name: 'Công ty',
      path: '/companies',
      icon: <Building size={20} />,
    },
    {
      name: 'Tài khoản',
      path: user ? '/profile' : '/auth',
      icon: <User size={20} />,
    },
    {
      name: 'Menu',
      path: '/menu',
      icon: <Menu size={20} />,
    },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={cn(
            'mobile-nav-item text-xs focus:outline-none',
            isActive(item.path)
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.icon}
          <span className="mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
