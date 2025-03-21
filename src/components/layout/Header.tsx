import { useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from './NotificationBell';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function Header({ className, ...props }: HeaderProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
  )
}
