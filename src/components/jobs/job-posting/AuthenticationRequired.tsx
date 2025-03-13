
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuthenticationRequired = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Đăng nhập để tiếp tục</h1>
              <p className="text-muted-foreground">
                Bạn cần đăng nhập để đăng tin tuyển dụng trên TopMarketingJobs
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-6">
              <Button onClick={() => navigate('/auth')} size="lg">
                Đăng nhập ngay
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} size="lg">
                Quay lại trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
