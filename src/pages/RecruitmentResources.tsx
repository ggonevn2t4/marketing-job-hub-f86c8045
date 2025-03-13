
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LinkButton from '@/components/custom/LinkButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, FileText, Download, ArrowRight, BookOpen, Users, Target } from 'lucide-react';

const ResourceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  link, 
  isDownload = false 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  link: string; 
  isDownload?: boolean; 
}) => {
  return (
    <Card className="h-full hover:border-primary transition-all">
      <CardHeader>
        <Icon className="h-10 w-10 text-primary mb-3" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" asChild className="w-full justify-between">
          <a href={link} target="_blank" rel="noopener noreferrer">
            {isDownload ? 'Tải xuống' : 'Xem ngay'}
            {isDownload ? <Download className="h-4 w-4 ml-2" /> : <ArrowRight className="h-4 w-4 ml-2" />}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const RecruitmentResources = () => {
  return (
    <Layout>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Book className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Tài nguyên tuyển dụng</h1>
            <p className="text-xl text-muted-foreground">
              Khám phá các tài liệu, hướng dẫn và công cụ hữu ích giúp tối ưu hóa quá trình tuyển dụng của bạn
            </p>
          </div>

          <Tabs defaultValue="guides" className="space-y-8 max-w-6xl mx-auto">
            <div className="flex justify-center">
              <TabsList className="grid w-[600px] grid-cols-3">
                <TabsTrigger value="guides">Hướng dẫn & Bài viết</TabsTrigger>
                <TabsTrigger value="templates">Mẫu & Tài liệu</TabsTrigger>
                <TabsTrigger value="tools">Công cụ & Phân tích</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  title="Xây dựng chiến lược tuyển dụng Marketing hiệu quả"
                  description="Hướng dẫn toàn diện về cách xây dựng chiến lược tuyển dụng nhân sự Marketing chất lượng cao."
                  icon={BookOpen}
                  link="#"
                />
                <ResourceCard
                  title="Phỏng vấn ứng viên Marketing: Những câu hỏi cần thiết"
                  description="Danh sách các câu hỏi phỏng vấn giúp đánh giá chính xác năng lực của ứng viên Marketing."
                  icon={FileText}
                  link="#"
                />
                <ResourceCard
                  title="Các xu hướng tuyển dụng Digital Marketing 2023"
                  description="Phân tích chi tiết về các xu hướng mới nhất trong tuyển dụng và phát triển nhân tài Digital Marketing."
                  icon={Target}
                  link="#"
                />
                <ResourceCard
                  title="Xây dựng thương hiệu nhà tuyển dụng trong ngành Marketing"
                  description="Cách xây dựng và phát triển thương hiệu nhà tuyển dụng hấp dẫn với ứng viên Marketing."
                  icon={Users}
                  link="#"
                />
                <ResourceCard
                  title="Đánh giá và phát triển nhân viên Marketing"
                  description="Phương pháp đánh giá hiệu suất và phát triển nhân viên Marketing trong tổ chức của bạn."
                  icon={Target}
                  link="#"
                />
                <ResourceCard
                  title="Các kỹ năng cần có của Marketing Manager"
                  description="Tổng hợp các kỹ năng cần thiết cho vị trí Marketing Manager hiện đại."
                  icon={BookOpen}
                  link="#"
                />
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  title="Mẫu mô tả công việc Marketing Manager"
                  description="Mẫu mô tả công việc chi tiết cho vị trí Marketing Manager có thể tùy chỉnh theo nhu cầu của công ty."
                  icon={FileText}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Mẫu đánh giá ứng viên Digital Marketing"
                  description="Công cụ đánh giá ứng viên Digital Marketing một cách khách quan và toàn diện."
                  icon={FileText}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Bảng câu hỏi phỏng vấn Content Marketing"
                  description="Danh sách câu hỏi phỏng vấn chuyên sâu dành cho vị trí Content Marketing."
                  icon={FileText}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Mẫu offer letter cho vị trí Marketing"
                  description="Mẫu thư đề nghị làm việc chuyên nghiệp dành cho các vị trí Marketing."
                  icon={FileText}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Mẫu KPI cho nhân viên Marketing"
                  description="Bảng KPI chi tiết có thể sử dụng để đánh giá hiệu suất nhân viên Marketing."
                  icon={FileText}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Quy trình onboarding nhân viên Marketing"
                  description="Quy trình onboarding chuẩn dành cho nhân viên Marketing mới."
                  icon={FileText}
                  link="#"
                  isDownload
                />
              </div>
            </TabsContent>

            <TabsContent value="tools">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ResourceCard
                  title="Công cụ tính toán ngân sách tuyển dụng"
                  description="Bảng tính giúp dự toán và theo dõi ngân sách tuyển dụng Marketing một cách hiệu quả."
                  icon={Target}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Bộ đánh giá kỹ năng Digital Marketing"
                  description="Bộ công cụ đánh giá toàn diện kỹ năng Digital Marketing cho ứng viên."
                  icon={Target}
                  link="#"
                />
                <ResourceCard
                  title="Phân tích thị trường lương Marketing 2023"
                  description="Báo cáo chi tiết về thị trường lương trong ngành Marketing tại Việt Nam."
                  icon={Target}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Công cụ phân tích hiệu quả tuyển dụng"
                  description="Công cụ giúp đo lường và tối ưu hiệu quả của quy trình tuyển dụng Marketing."
                  icon={Target}
                  link="#"
                />
                <ResourceCard
                  title="Báo cáo xu hướng thị trường nhân sự Marketing"
                  description="Phân tích chuyên sâu về cung-cầu và xu hướng thị trường nhân sự Marketing."
                  icon={FileText}
                  link="#"
                  isDownload
                />
                <ResourceCard
                  title="Checklist đánh giá văn hóa doanh nghiệp"
                  description="Công cụ đánh giá sự phù hợp giữa ứng viên và văn hóa doanh nghiệp của bạn."
                  icon={FileText}
                  link="#"
                  isDownload
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-16 text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Bạn cần tư vấn thêm?</h2>
              <p className="text-muted-foreground">
                Nhận tư vấn miễn phí từ đội ngũ chuyên gia tuyển dụng Marketing của chúng tôi
              </p>
            </div>
            <LinkButton to="/contact" size="lg">
              Liên hệ ngay
            </LinkButton>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecruitmentResources;
