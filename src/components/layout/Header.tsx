
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import LinkButton from "@/components/custom/LinkButton";
import NotificationBell from "@/components/layout/NotificationBell";
import { 
  Briefcase, 
  LogOut, 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  Menu,
  X,
  Home,
  Building2,
  FileText
} from "lucide-react";
import { UserRole } from "@/types/auth";
import { CandidateProfile, CompanyProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<Partial<CandidateProfile | CompanyProfile> | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const tableName = role === 'employer' ? 'companies' : 'profiles';
          
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (data) {
            if (role === 'employer') {
              setProfileData(data as CompanyProfile);
            } else {
              setProfileData(data as Partial<CandidateProfile>);
            }
          }
        } catch (error) {
          console.error("Unexpected error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [user, role]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error("Error fetching user role:", error);
          } else if (data) {
            setRole(data.role);
          }
        } catch (error) {
          console.error("Unexpected error fetching user role:", error);
        }
      } else {
        setRole(null);
        setProfileData(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Đăng xuất thành công!",
        description: "Bạn đã đăng xuất khỏi tài khoản.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Đăng xuất thất bại",
        description: error.message,
      });
    }
  };

  const getAvatarUrl = () => {
    if (!profileData) return '';
    
    if (role === 'employer') {
      return (profileData as CompanyProfile)?.logo || '';
    } else {
      return (profileData as Partial<CandidateProfile>)?.avatar_url || '';
    }
  };

  const getProfileName = () => {
    if (!profileData) return user?.email || '';
    
    if (role === 'employer') {
      return (profileData as CompanyProfile)?.name || user?.email || '';
    } else {
      return (profileData as Partial<CandidateProfile>)?.full_name || user?.email || '';
    }
  };

  // Mobile navigation links
  const NavigationLinks = () => (
    <div className={cn("flex", isMobile ? "flex-col space-y-4" : "items-center space-x-4")}>
      <LinkButton to="/jobs">Việc làm</LinkButton>
      <LinkButton to="/companies">Công ty</LinkButton>
      <LinkButton to="/blog">Blog</LinkButton>
    </div>
  );

  // User menu content that's shared between mobile and desktop
  const UserMenuContent = () => (
    <>
      <div className="flex flex-col space-y-1">
        <p className="text-sm font-medium leading-none">{getProfileName()}</p>
        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
      </div>
      <div className="mt-4 space-y-2">
        <MenuItem to="/dashboard" icon={<LayoutDashboard className="mr-2 h-4 w-4" />} label="Bảng điều khiển" />
        <MenuItem to={role === 'employer' ? '/company-profile' : '/profile'} icon={<User className="mr-2 h-4 w-4" />} label="Hồ sơ" />
        <MenuItem to="/messages" icon={<MessageSquare className="mr-2 h-4 w-4" />} label="Tin nhắn" />
        {role === 'employer' && (
          <MenuItem to="/manage-jobs" icon={<Briefcase className="mr-2 h-4 w-4" />} label="Quản lý tin tuyển dụng" />
        )}
      </div>
      <div className="mt-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </Button>
      </div>
    </>
  );

  // Menu item component for both mobile and desktop menus
  const MenuItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <Link to={to} className={cn(
      "flex items-center text-sm",
      isMobile ? "py-2 px-2 hover:bg-muted rounded-md transition-colors" : ""
    )} onClick={() => setIsOpen(false)}>
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="bg-background sticky top-0 z-40 border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <span className="font-bold text-lg">Job Board</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <ModeToggle />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center pb-4 border-b mb-4">
                    <h2 className="font-semibold">Menu</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <NavigationLinks />
                    
                    {user ? (
                      <div className="pt-4 border-t">
                        <div className="flex items-center mb-4 space-x-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={getAvatarUrl()} alt={user?.email || ''} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <UserMenuContent />
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t">
                        <Button className="w-full" asChild>
                          <Link to="/auth" onClick={() => setIsOpen(false)}>Đăng nhập</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <NavigationLinks />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl()} alt={user?.email || ''} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getProfileName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Bảng điều khiển</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={role === 'employer' ? '/company-profile' : '/profile'}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/messages">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Tin nhắn</span>
                      </Link>
                    </DropdownMenuItem>
                    {role === 'employer' && (
                      <DropdownMenuItem asChild>
                        <Link to="/manage-jobs">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Quản lý tin tuyển dụng</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <LinkButton to="/auth">Đăng nhập</LinkButton>
              </>
            )}
            <NotificationBell />
            <ModeToggle />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
