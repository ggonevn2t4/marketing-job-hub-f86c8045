
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

export const AuthenticationRequired = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <LockKeyhole className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3">Đăng nhập để tiếp tục</h2>
                <p className="text-muted-foreground mb-6">
                  Bạn cần đăng nhập vào tài khoản nhà tuyển dụng để đăng tin tuyển dụng
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button onClick={() => navigate('/auth')} className="min-w-28">
                    Đăng nhập
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')} className="min-w-28">
                    Quay lại
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
