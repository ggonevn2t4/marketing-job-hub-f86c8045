import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LinkButton from '../custom/LinkButton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="py-4 border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            Job<span className="text-secondary">Ease</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-secondary transition-colors">
              Trang chủ
            </Link>
            <Link to="/jobs" className="hover:text-secondary transition-colors">
              Việc làm
            </Link>
            <Link to="/companies" className="hover:text-secondary transition-colors">
              Công ty
            </Link>
            <Link to="/blog" className="hover:text-secondary transition-colors">
              Blog
            </Link>
            <Link to="/about" className="hover:text-secondary transition-colors">
              Về chúng tôi
            </Link>
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                        <AvatarFallback>{user.full_name?.slice(0, 2) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/saved-jobs')}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      <span>Việc làm đã lưu</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LinkButton to="/auth">Đăng nhập</LinkButton>
                <LinkButton to="/auth" variant="secondary">
                  Đăng ký
                </LinkButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b z-50">
          <nav className="px-6 py-4 flex flex-col space-y-3">
            <Link to="/" className="block hover:text-secondary transition-colors" onClick={closeMenu}>
              Trang chủ
            </Link>
            <Link to="/jobs" className="block hover:text-secondary transition-colors" onClick={closeMenu}>
              Việc làm
            </Link>
            <Link to="/companies" className="block hover:text-secondary transition-colors" onClick={closeMenu}>
              Công ty
            </Link>
            <Link to="/blog" className="block hover:text-secondary transition-colors" onClick={closeMenu}>
              Blog
            </Link>
            <Link to="/about" className="block hover:text-secondary transition-colors" onClick={closeMenu}>
              Về chúng tôi
            </Link>
            {!user ? (
              <>
                <LinkButton to="/auth" className="block text-center" onClick={closeMenu}>
                  Đăng nhập
                </LinkButton>
                <LinkButton to="/auth" variant="secondary" className="block text-center" onClick={closeMenu}>
                  Đăng ký
                </LinkButton>
              </>
            ) : (
              <>
                <Link to="/profile" className="block hover:text-secondary transition-colors" onClick={closeMenu}>
                  Hồ sơ
                </Link>
                <Button variant="outline" className="w-full" onClick={() => {
                  logout();
                  closeMenu();
                }}>
                  Đăng xuất
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
