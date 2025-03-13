
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FilePlus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center">
              <FilePlus className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-3">Đăng tin tuyển dụng</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Tiếp cận hàng ngàn ứng viên Marketing tiềm năng và quảng bá thương hiệu nhà tuyển dụng của bạn với TopMarketingJobs
              </p>
            </div>

            <Tabs defaultValue="job-form" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="job-form">Thông tin tuyển dụng</TabsTrigger>
                <TabsTrigger value="company-details">Thông tin công ty</TabsTrigger>
                <TabsTrigger value="preview">Xem trước & Thanh toán</TabsTrigger>
              </TabsList>

              <TabsContent value="job-form" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Chức danh công việc <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="VD: Marketing Manager"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ngành nghề <span className="text-red-500">*</span></label>
                          <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                            <option value="">Chọn ngành nghề</option>
                            <option value="digital-marketing">Digital Marketing</option>
                            <option value="brand-marketing">Brand Marketing</option>
                            <option value="content-marketing">Content Marketing</option>
                            <option value="seo">SEO</option>
                            <option value="sem">SEM</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Loại hình công việc <span className="text-red-500">*</span></label>
                          <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                            <option value="">Chọn loại hình</option>
                            <option value="full-time">Toàn thời gian</option>
                            <option value="part-time">Bán thời gian</option>
                            <option value="freelance">Freelance</option>
                            <option value="remote">Remote</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Kinh nghiệm <span className="text-red-500">*</span></label>
                          <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                            <option value="">Chọn kinh nghiệm</option>
                            <option value="fresher">Fresher (0-1 năm)</option>
                            <option value="junior">Junior (1-2 năm)</option>
                            <option value="middle">Middle (2-5 năm)</option>
                            <option value="senior">Senior (5+ năm)</option>
                            <option value="manager">Manager (7+ năm)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Địa điểm làm việc <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="VD: Quận 1, TP.HCM"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Mức lương (tháng)</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                              placeholder="Từ"
                            />
                            <input 
                              type="text" 
                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                              placeholder="Đến"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Mô tả công việc <span className="text-red-500">*</span></label>
                        <textarea 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-32"
                          placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                          required
                        ></textarea>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Yêu cầu ứng viên <span className="text-red-500">*</span></label>
                        <textarea 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-32"
                          placeholder="Kỹ năng, trình độ học vấn, kinh nghiệm..."
                          required
                        ></textarea>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quyền lợi</label>
                        <textarea 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-32"
                          placeholder="Chế độ lương thưởng, bảo hiểm, đào tạo..."
                        ></textarea>
                      </div>

                      <div className="flex justify-end">
                        <Button type="button">Tiếp tục</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company-details">
                <Card>
                  <CardContent className="pt-6">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tên công ty <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          placeholder="VD: TopMarketingJobs"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email liên hệ <span className="text-red-500">*</span></label>
                          <input 
                            type="email" 
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Email nhận CV ứng viên"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Số điện thoại</label>
                          <input 
                            type="tel" 
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Số điện thoại liên hệ"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Logo công ty</label>
                        <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <div className="flex flex-col items-center">
                            <Button variant="outline" size="sm">Tải lên Logo</Button>
                            <p className="text-xs text-muted-foreground mt-2">PNG, JPG hoặc SVG (Tối đa 1MB)</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website công ty</label>
                        <input 
                          type="url" 
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          placeholder="https://www.company.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Giới thiệu công ty</label>
                        <textarea 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-32"
                          placeholder="Mô tả về công ty, văn hóa, sứ mệnh..."
                        ></textarea>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Quay lại</Button>
                        <Button type="button">Tiếp tục</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <Alert>
                        <AlertTitle className="text-lg font-semibold">Xem trước tin tuyển dụng</AlertTitle>
                        <AlertDescription>
                          Vui lòng kiểm tra lại nội dung trước khi đăng tuyển
                        </AlertDescription>
                      </Alert>
                      
                      <div className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 w-16 h-16 rounded flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-400">Logo</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Marketing Manager</h3>
                            <p className="text-muted-foreground">TopMarketingJobs</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Vị trí:</span>
                            <span>Marketing Manager</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Loại hình:</span>
                            <span>Toàn thời gian</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Kinh nghiệm:</span>
                            <span>3-5 năm</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Địa điểm:</span>
                            <span>Quận 1, TP.HCM</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Mức lương:</span>
                            <span>15,000,000 - 25,000,000 VNĐ</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Gói dịch vụ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all">
                            <div className="text-center mb-4">
                              <h4 className="text-lg font-bold">Cơ bản</h4>
                              <p className="text-2xl font-bold mt-2">1,000,000 VNĐ</p>
                              <p className="text-sm text-muted-foreground">30 ngày</p>
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Hiển thị 30 ngày
                              </li>
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Tiếp cận không giới hạn ứng viên
                              </li>
                              <li className="flex items-center text-muted-foreground">
                                <svg className="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Đẩy tin tuyển dụng
                              </li>
                            </ul>
                          </div>
                          
                          <div className="border-2 border-primary rounded-lg p-4 relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs px-2 py-1 rounded">
                              Phổ biến nhất
                            </div>
                            <div className="text-center mb-4">
                              <h4 className="text-lg font-bold">Nâng cao</h4>
                              <p className="text-2xl font-bold mt-2">2,500,000 VNĐ</p>
                              <p className="text-sm text-muted-foreground">30 ngày</p>
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Hiển thị 30 ngày
                              </li>
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Tiếp cận không giới hạn ứng viên
                              </li>
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Đẩy tin tuyển dụng (7 ngày)
                              </li>
                            </ul>
                          </div>
                          
                          <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-all">
                            <div className="text-center mb-4">
                              <h4 className="text-lg font-bold">Premium</h4>
                              <p className="text-2xl font-bold mt-2">5,000,000 VNĐ</p>
                              <p className="text-sm text-muted-foreground">30 ngày</p>
                            </div>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Hiển thị 30 ngày
                              </li>
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Tiếp cận không giới hạn ứng viên
                              </li>
                              <li className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Đẩy tin tuyển dụng (15 ngày)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Quay lại</Button>
                          <Button>Thanh toán & Đăng tuyển</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
