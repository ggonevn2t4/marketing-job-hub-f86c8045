
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';

const AuthCallback = () => {
  const { processAuthCallback, isLoading } = useAuth();

  useEffect(() => {
    processAuthCallback();
  }, [processAuthCallback]);

  return (
    <Layout>
      <div className="container py-16">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>{isLoading ? 'Đang xác thực...' : 'Đang chuyển hướng...'}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthCallback;
