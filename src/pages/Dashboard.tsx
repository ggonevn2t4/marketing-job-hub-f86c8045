
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/auth');
      } else if (userRole === 'candidate') {
        // Redirect to candidate dashboard
        navigate('/dashboard/candidate');
      } else if (userRole === 'employer') {
        // Redirect to employer dashboard
        navigate('/dashboard/employer');
      }
    }
  }, [user, userRole, isLoading, navigate]);

  // Show loading state while checking authentication
  return (
    <div className="container py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-32 w-full max-w-2xl" />
      </div>
    </div>
  );
};

export default Dashboard;
