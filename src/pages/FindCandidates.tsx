
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserSearch, Briefcase, GraduationCap, Mail, MapPin, Phone, AlertCircle } from 'lucide-react';

const CandidateCard = () => {
  return (
    <Card className="hover:border-primary transition-all cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
              NT
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-1">Nguyễn Thành</h3>
            <p className="text-primary font-medium mb-2">Digital Marketing Specialist</p>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin size={16} className="mr-1" />
              <span>TP. Hồ Chí Minh</span>
              <span className="mx-2">•</span>
              <Briefcase size={16} className="mr-1" />
              <span>3 năm kinh nghiệm</span>
              <span className="mx-2">•</span>
              <GraduationCap size={16} className="mr-1" />
              <span>Đại học</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Content Marketing</Badge>
              <Badge variant="secondary">Social Media</Badge>
              <Badge variant="secondary">SEO</Badge>
              <Badge variant="secondary">Google Ads</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Button size="sm" variant="outline">
                  <Phone size={14} className="mr-1" /> Liên hệ
                </Button>
                <Button size="sm" variant="outline">
                  <Mail size={14} className="mr-1" /> Gửi email
                </Button>
              </div>
              <Button size="sm">Xem chi tiết</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FindCandidates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // If not logged in, prompt to login
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-3xl mx-auto shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Đăng nhập để tiếp tục</h1>
                <p className="text-muted-foreground">
                  Bạn cần đăng nhập để tìm kiếm ứng viên trên TopMarketingJobs
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
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <UserSearch className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-3">Tìm kiếm ứng viên</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Tiếp cận ứng viên Marketing tiềm năng phù hợp với nhu cầu tuyển dụng của doanh nghiệp
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      placeholder="Tìm kiếm theo kỹ năng, vị trí..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Button className="w-full">Tìm kiếm</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Vị trí</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="content-marketing">Content Marketing</option>
                    <option value="seo-specialist">SEO Specialist</option>
                    <option value="sem-specialist">SEM Specialist</option>
                    <option value="social-media">Social Media</option>
                  </select>

                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Địa điểm</option>
                    <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                    <option value="ha-noi">Hà Nội</option>
                    <option value="da-nang">Đà Nẵng</option>
                    <option value="other">Khác</option>
                  </select>

                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Kinh nghiệm</option>
                    <option value="fresher">Fresher (0-1 năm)</option>
                    <option value="junior">Junior (1-2 năm)</option>
                    <option value="middle">Middle (2-5 năm)</option>
                    <option value="senior">Senior (5+ năm)</option>
                  </select>

                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Kỹ năng</option>
                    <option value="content-writing">Content Writing</option>
                    <option value="seo">SEO</option>
                    <option value="google-ads">Google Ads</option>
                    <option value="facebook-ads">Facebook Ads</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="new">Mới nhất</TabsTrigger>
                <TabsTrigger value="saved">Đã lưu</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Hiển thị 1-10 trên 56 ứng viên</p>
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="latest">Mới nhất</option>
                    <option value="relevant">Phù hợp nhất</option>
                    <option value="experience">Kinh nghiệm</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <CandidateCard key={index} />
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button variant="outline">Xem thêm ứng viên</Button>
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Hiển thị 1-10 trên 24 ứng viên</p>
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="latest">Mới nhất</option>
                    <option value="relevant">Phù hợp nhất</option>
                    <option value="experience">Kinh nghiệm</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((index) => (
                    <CandidateCard key={index} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Hiển thị 1-5 trên 5 ứng viên</p>
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="latest">Mới nhất</option>
                    <option value="relevant">Phù hợp nhất</option>
                    <option value="experience">Kinh nghiệm</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[1, 2].map((index) => (
                    <CandidateCard key={index} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindCandidates;
