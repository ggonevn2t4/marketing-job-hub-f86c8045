
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Search, Filter, MapPin, BarChart, LineChart, PieChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         LineChart as RechartsLineChart, Line } from 'recharts';

const cityData = [
  { name: 'Hồ Chí Minh', junior: 10, middle: 18, senior: 30 },
  { name: 'Hà Nội', junior: 9, middle: 16, senior: 28 },
  { name: 'Đà Nẵng', junior: 8, middle: 14, senior: 24 },
  { name: 'Cần Thơ', junior: 7, middle: 12, senior: 20 },
  { name: 'Hải Phòng', junior: 7.5, middle: 13, senior: 22 },
];

const trendData = [
  { year: '2018', salary: 8 },
  { year: '2019', salary: 10 },
  { year: '2020', salary: 11 },
  { year: '2021', salary: 14 },
  { year: '2022', salary: 16 },
  { year: '2023', salary: 18 },
];

const roleData = [
  { role: 'Digital Marketing Manager', salary: 25 },
  { role: 'SEO Specialist', salary: 15 },
  { role: 'Content Marketing', salary: 14 },
  { role: 'Social Media Marketing', salary: 14 },
  { role: 'SEM/PPC Specialist', salary: 16 },
  { role: 'Email Marketing', salary: 14 },
  { role: 'Marketing Analytics', salary: 20 },
  { role: 'Brand Marketing', salary: 18 },
  { role: 'Ecommerce Marketing', salary: 17 },
  { role: 'Marketing Director', salary: 40 },
];

const SalaryCard = ({ 
  title, 
  rangeLow, 
  rangeHigh, 
  average, 
  icon: Icon 
}: { 
  title: string; 
  rangeLow: number; 
  rangeHigh: number; 
  average: number; 
  icon: React.ElementType;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="text-3xl font-bold text-primary">{average} triệu</div>
            <div className="text-sm text-muted-foreground mt-1">
              {rangeLow} - {rangeHigh} triệu VNĐ/tháng
            </div>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SalaryInfo = () => {
  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <DollarSign className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-3">Thông tin lương Marketing</h1>
            <p className="text-muted-foreground">
              Tra cứu mức lương trung bình theo vị trí, kinh nghiệm và khu vực địa lý
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo chức danh..."
                    className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Địa điểm..."
                    className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
                  />
                </div>
                <button className="bg-primary text-white rounded-md px-4 py-2 md:w-auto w-full">
                  Tra cứu
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <SalaryCard 
              title="Digital Marketing" 
              rangeLow={10} 
              rangeHigh={30} 
              average={18} 
              icon={BarChart} 
            />
            <SalaryCard 
              title="Content Marketing" 
              rangeLow={8} 
              rangeHigh={25} 
              average={15} 
              icon={BarChart} 
            />
            <SalaryCard 
              title="SEO/SEM" 
              rangeLow={12} 
              rangeHigh={28} 
              average={17} 
              icon={LineChart} 
            />
            <SalaryCard 
              title="Social Media" 
              rangeLow={8} 
              rangeHigh={22} 
              average={14} 
              icon={PieChart} 
            />
          </div>

          <Tabs defaultValue="by-role" className="space-y-8">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="by-role">Theo vị trí</TabsTrigger>
              <TabsTrigger value="by-location">Theo khu vực</TabsTrigger>
              <TabsTrigger value="trends">Xu hướng</TabsTrigger>
            </TabsList>

            <TabsContent value="by-role">
              <Card>
                <CardHeader>
                  <CardTitle>Mức lương theo vị trí Marketing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={roleData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 160, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 50]} tickFormatter={(value) => `${value}tr`} />
                        <YAxis type="category" dataKey="role" width={150} />
                        <Tooltip formatter={(value) => [`${value} triệu`, 'Mức lương trung bình']} />
                        <Bar dataKey="salary" fill="#8a87de" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-location">
              <Card>
                <CardHeader>
                  <CardTitle>Mức lương Marketing theo khu vực</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={cityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value}tr`} />
                        <Tooltip formatter={(value) => [`${value} triệu`, 'Mức lương trung bình']} />
                        <Bar dataKey="junior" name="Junior (1-2 năm)" stackId="a" fill="#90cdf4" />
                        <Bar dataKey="middle" name="Middle (2-5 năm)" stackId="a" fill="#63b3ed" />
                        <Bar dataKey="senior" name="Senior (5+ năm)" stackId="a" fill="#4299e1" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng lương Marketing 2018-2023</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={trendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `${value}tr`} />
                        <Tooltip formatter={(value) => [`${value} triệu`, 'Mức lương trung bình']} />
                        <Line type="monotone" dataKey="salary" stroke="#8a87de" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Yếu tố ảnh hưởng đến mức lương</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Kinh nghiệm làm việc</h4>
                      <p className="text-sm text-muted-foreground">
                        Kinh nghiệm là yếu tố quan trọng nhất, với mỗi năm kinh nghiệm có thể tăng lương 10-15%.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Kỹ năng chuyên môn</h4>
                      <p className="text-sm text-muted-foreground">
                        Các kỹ năng như Google Analytics, SEO nâng cao, quản lý quảng cáo có thể tăng mức lương lên 20-30%.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Quy mô công ty</h4>
                      <p className="text-sm text-muted-foreground">
                        Các công ty lớn thường trả lương cao hơn so với các công ty nhỏ và startup (trung bình 15-25%).
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Ngành công nghiệp</h4>
                      <p className="text-sm text-muted-foreground">
                        Mức lương có thể dao động 10-20% tùy thuộc vào ngành (công nghệ trả cao nhất, tiếp theo là tài chính).
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cải thiện mức lương Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Nâng cao kỹ năng kỹ thuật</h4>
                      <p className="text-sm text-muted-foreground">
                        Học các kỹ năng phân tích dữ liệu, Google Analytics, SEO/SEM nâng cao, marketing automation.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Lấy chứng chỉ chuyên ngành</h4>
                      <p className="text-sm text-muted-foreground">
                        Các chứng chỉ của Google, HubSpot, Facebook Blueprint có thể giúp tăng mức lương lên 10-15%.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Xây dựng portfolio ấn tượng</h4>
                      <p className="text-sm text-muted-foreground">
                        Chứng minh kết quả cụ thể từ các chiến dịch (ROI, tăng trưởng, KPIs) bạn đã thực hiện.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Phát triển kỹ năng quản lý</h4>
                      <p className="text-sm text-muted-foreground">
                        Kỹ năng lãnh đạo và quản lý dự án có thể giúp bạn tiến lên các vị trí quản lý cấp cao hơn.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Nhận báo cáo lương chi tiết</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Đăng ký nhận báo cáo lương Marketing đầy đủ theo ngành, vị trí và kinh nghiệm
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2"
              />
              <button className="bg-primary text-white rounded-md px-6 py-2">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalaryInfo;
