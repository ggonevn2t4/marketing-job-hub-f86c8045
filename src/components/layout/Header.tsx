
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from './NotificationBell';

// Mock site config
const siteConfig = {
  name: "WorkConnect",
  mainNav: [
    { title: "Trang chủ", href: "/" },
    { title: "Việc làm", href: "/jobs" },
    { title: "Công ty", href: "/companies" },
    { title: "Blog", href: "/blog" },
    { title: "Liên hệ", href: "/contact" },
  ]
};

// Mock Icons object for simplicity
const Icons = {
  logo: (props: any) => <svg {...props} viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>,
  menu: (props: any) => <svg {...props} viewBox="0 0 24 24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
};

// Mock UserNav component
const UserNav = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Link to="/auth">
        <Button>Đăng nhập</Button>
      </Link>
    );
  }
  
  return (
    <Avatar>
      <AvatarImage src="/placeholder.svg" alt="User" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
};

// Mock ModeToggle component
const ModeToggle = () => {
  const { setTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM7.5 12C7.77614 12 8 12.2239 8 12.5V14.5C8 14.7761 7.77614 15 7.5 15C7.22386 15 7 14.7761 7 14.5V12.5C7 12.2239 7.22386 12 7.5 12ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM12 7.5C12 7.22386 12.2239 7 12.5 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H12.5C12.2239 8 12 7.77614 12 7.5ZM10.682 4.31802C10.4867 4.51328 10.1701 4.51328 9.97487 4.31802C9.77961 4.12276 9.77961 3.80617 9.97487 3.61091L11.3891 2.1967C11.5843 2.00144 11.9009 2.00144 12.0962 2.1967C12.2915 2.39196 12.2915 2.70854 12.0962 2.90381L10.682 4.31802ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z" fill="currentColor"></path></svg>
      </Button>
    </div>
  );
};

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function Header({ className, ...props }: HeaderProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
  };

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background", className)} {...props}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <div className="flex items-center">
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="sm" className="px-0">
                <Icons.menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <Link to="/" className="mr-4 flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
            </Link>
          </div>
          <SheetContent side="left" className="pr-0">
            <Link to="/" className="mr-4 flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
            <div className="py-4 text-muted-foreground">
              <p>Ứng dụng tìm kiếm việc làm hàng đầu Việt Nam</p>
            </div>
            {siteConfig.mainNav?.length ? (
              <div className="grid gap-6">
                {siteConfig.mainNav.map((item, index) => (
                  <Link className="text-lg font-medium" to={item.href} key={index}>
                    {item.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </SheetContent>
        </Sheet>
        <div className="hidden sm:flex flex-1 items-center justify-center space-x-8">
          {siteConfig.mainNav?.length ? (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {siteConfig.mainNav.map((item, index) => (
                <Link
                  to={item.href}
                  key={index}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <UserNav />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
