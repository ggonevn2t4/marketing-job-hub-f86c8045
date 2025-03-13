import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import JobList from '@/components/jobs/JobList';
import { Briefcase, MapPin, Filter, Search } from 'lucide-react';

const mockJobs = [
  {
    id: '1',
    title: 'Digital Marketing Manager',
    company: 'Tech Solutions',
    logo: '/placeholder.svg',
    location: 'TP. Hồ Chí Minh',
    salary: '20 - 25 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '3 - 5 năm',
    postedAt: '3 ngày trước',
    isFeatured: true,
    isHot: true,
  },
  {
    id: '2',
    title: 'Content Marketing Specialist',
    company: 'Creative Agency',
    logo: '/placeholder.svg',
    location: 'Hà Nội',
    salary: '15 - 18 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '1 tuần trước',
    isFeatured: false,
    isHot: false,
  },
  {
    id: '3',
    title: 'SEO Specialist',
    company: 'Digital Enterprise',
    logo: '/placeholder.svg',
    location: 'TP. Hồ Chí Minh',
    salary: '12 - 15 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '5 ngày trước',
    isFeatured: false,
    isHot: true,
  },
  {
    id: '4',
    title: 'Brand Marketing Manager',
    company: 'Consumer Goods Co.',
    logo: '/placeholder.svg',
    location: 'TP. Hồ Chí Minh',
    salary: '25 - 30 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '3 - 5 năm',
    postedAt: '2 ngày trước',
    isFeatured: true,
    isHot: false,
  },
  {
    id: '5',
    title: 'Social Media Specialist',
    company: 'Fashion Brand',
    logo: '/placeholder.svg',
    location: 'Đà Nẵng',
    salary: '10 - 13 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: 'Dưới 1 năm',
    postedAt: '1 tuần trước',
    isFeatured: false,
    isHot: false,
  },
  {
    id: '6',
    title: 'Marketing Analytics Specialist',
    company: 'E-commerce Corp',
    logo: '/placeholder.svg',
    location: 'Hà Nội',
    salary: '18 - 22 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '3 ngày trước',
    isFeatured: false,
    isHot: true,
  },
  {
    id: '7',
    title: 'Email Marketing Specialist',
    company: 'SaaS Company',
    logo: '/placeholder.svg',
    location: 'TP. Hồ Chí Minh',
    salary: '14 - 16 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '2 tuần trước',
    isFeatured: false,
    isHot: false,
  },
  {
    id: '8',
    title: 'SEM Specialist',
    company: 'Digital Agency',
    logo: '/placeholder.svg',
    location: 'TP. Hồ Chí Minh',
    salary: '15 - 20 triệu',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '4 ngày trước',
    isFeatured: false,
    isHot: false,
  },
];

const FindJobs = () => {
  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-3">Tìm việc làm Marketing</h1>
            <p className="text-muted-foreground">
              Khám phá hàng ngàn cơ hội việc làm Marketing hấp dẫn tại các công ty hàng đầu
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Chức danh, kỹ năng, công ty..."
                    className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Địa điểm làm việc..."
                    className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                <Button className="md:w-auto w-full">Tìm kiếm</Button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" className="text-xs">
                  <Filter className="h-3 w-3 mr-1" /> Lọc nâng cao
                </Button>
                <div className="flex gap-2 overflow-x-auto pb-2 text-xs">
                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full">Digital Marketing</Button>
                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full">Content Marketing</Button>
                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full">SEO/SEM</Button>
                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full">Social Media</Button>
                  <Button variant="outline" size="sm" className="text-xs whitespace-nowrap rounded-full">Brand Marketing</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-5 space-y-5">
                  <div>
                    <h3 className="font-medium mb-3">Ngành nghề</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="cat1" className="mr-2" />
                        <label htmlFor="cat1" className="text-sm">Digital Marketing</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="cat2" className="mr-2" />
                        <label htmlFor="cat2" className="text-sm">Content Marketing</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="cat3" className="mr-2" />
                        <label htmlFor="cat3" className="text-sm">SEO/SEM</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="cat4" className="mr-2" />
                        <label htmlFor="cat4" className="text-sm">Social Media Marketing</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="cat5" className="mr-2" />
                        <label htmlFor="cat5" className="text-sm">Brand Marketing</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="cat6" className="mr-2" />
                        <label htmlFor="cat6" className="text-sm">Email Marketing</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Địa điểm</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="loc1" className="mr-2" />
                        <label htmlFor="loc1" className="text-sm">TP. Hồ Chí Minh</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="loc2" className="mr-2" />
                        <label htmlFor="loc2" className="text-sm">Hà Nội</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="loc3" className="mr-2" />
                        <label htmlFor="loc3" className="text-sm">Đà Nẵng</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="loc4" className="mr-2" />
                        <label htmlFor="loc4" className="text-sm">Khác</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Mức lương</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="sal1" className="mr-2" />
                        <label htmlFor="sal1" className="text-sm">Dưới 10 triệu</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="sal2" className="mr-2" />
                        <label htmlFor="sal2" className="text-sm">10 - 15 triệu</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="sal3" className="mr-2" />
                        <label htmlFor="sal3" className="text-sm">15 - 20 triệu</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="sal4" className="mr-2" />
                        <label htmlFor="sal4" className="text-sm">20 - 30 triệu</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="sal5" className="mr-2" />
                        <label htmlFor="sal5" className="text-sm">Trên 30 triệu</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Kinh nghiệm</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="exp1" className="mr-2" />
                        <label htmlFor="exp1" className="text-sm">Chưa có kinh nghiệm</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="exp2" className="mr-2" />
                        <label htmlFor="exp2" className="text-sm">Dưới 1 năm</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="exp3" className="mr-2" />
                        <label htmlFor="exp3" className="text-sm">1 - 3 năm</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="exp4" className="mr-2" />
                        <label htmlFor="exp4" className="text-sm">3 - 5 năm</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="exp5" className="mr-2" />
                        <label htmlFor="exp5" className="text-sm">Trên 5 năm</label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Áp dụng bộ lọc</Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-medium mb-3">Đăng ký nhận việc làm mới</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nhận thông báo về các vị trí tuyển dụng mới phù hợp
                  </p>
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
                  />
                  <Button className="w-full">Đăng ký</Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Kết quả tìm kiếm</h2>
                <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option value="latest">Mới nhất</option>
                  <option value="relevant">Phù hợp nhất</option>
                  <option value="salary-high">Lương cao nhất</option>
                </select>
              </div>

              <JobList jobs={mockJobs} showLoadMore={true} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindJobs;
