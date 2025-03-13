
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
import { Briefcase, LogOut, LayoutDashboard, MessageSquare, User } from "lucide-react";
import { UserRole } from "@/types/auth";
import { CandidateProfile } from "@/types/profile";
import { CompanyProfile } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<CandidateProfile | CompanyProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          let tableName = 'profiles' as const;
          if (role === 'employer') {
            tableName = 'companies' as const;
          }

          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else {
            setProfileData(data as CandidateProfile | CompanyProfile);
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

  // Helper function to get avatar URL from different profile types
  const getAvatarUrl = () => {
    if (!profileData) return '';
    if ('avatar_url' in profileData) {
      return profileData.avatar_url || '';
    } else if ('logo' in profileData) {
      return profileData.logo || '';
    }
    return '';
  };

  // Helper function to get name from different profile types
  const getProfileName = () => {
    if (!profileData) return user?.email || '';
    if ('full_name' in profileData) {
      return profileData.full_name || user?.email || '';
    } else if ('name' in profileData) {
      return profileData.name || user?.email || '';
    }
    return user?.email || '';
  };

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <span className="font-bold">Job Board</span>
        </Link>
        <div className="flex items-center space-x-4">
          <LinkButton to="/jobs">Việc làm</LinkButton>
          <LinkButton to="/companies">Công ty</LinkButton>
          <LinkButton to="/blog">Blog</LinkButton>
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
      </div>
    </header>
  );
};

export default Header;
