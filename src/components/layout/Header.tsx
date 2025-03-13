
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { title: 'Trang chủ', path: '/' },
    { title: 'Việc làm', path: '/jobs' },
    { title: 'Công ty', path: '/companies' },
    { title: 'Blog', path: '/blog' },
    { title: 'Về chúng tôi', path: '/about' },
  ];

  if (user && userRole === 'candidate') {
    navItems.push({ title: 'Việc làm đã ứng tuyển', path: '/application-tracker' });
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 transition-all hover:opacity-80"
          >
            TopMarketingJobs
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              <Search size={16} />
              <span>Tìm kiếm</span>
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Button size="sm" variant="ghost" className="gap-2">
                  <User size={16} />
                  <span>{userRole === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}</span>
                </Button>
                <Button size="sm" variant="outline" onClick={signOut} className="gap-2">
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </Button>
              </div>
            ) : (
              <Button className="rounded-full" asChild>
                <Link to="/auth">Đăng nhập / Đăng ký</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t mt-4 animate-slide-down">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-base font-medium py-2 transition-colors',
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-foreground'
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Button variant="outline" className="justify-start gap-2">
                <Search size={16} />
                <span>Tìm kiếm</span>
              </Button>
              
              {user ? (
                <>
                  <Button variant="ghost" className="justify-start gap-2">
                    <User size={16} />
                    <span>{userRole === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}</span>
                  </Button>
                  <Button variant="outline" onClick={signOut} className="justify-start gap-2">
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link to="/auth">Đăng nhập / Đăng ký</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
