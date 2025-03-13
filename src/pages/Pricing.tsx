
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, HelpCircle, DollarSign } from 'lucide-react';

const PricingCard = ({ 
  title, 
  price, 
  duration, 
  features, 
  popular, 
  buttonText = "Chọn gói"
}: {
  title: string;
  price: string;
  duration: string;
  features: { included: boolean; text: string }[];
  popular?: boolean;
  buttonText?: string;
}) => {
  return (
    <Card className={`${popular ? 'border-primary border-2 relative' : ''}`}>
      {popular && (
        <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-2 py-1 rounded">
          Phổ biến nhất
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-sm text-muted-foreground ml-1">/{duration}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <div className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <span className={feature.included ? '' : 'text-muted-foreground'}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? '' : 'variant-outline'}`}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing = () => {
  const recruitmentFeatures = [
    {
      title: "Cơ bản",
      price: "1,000,000 VNĐ",
      duration: "30 ngày",
      features: [
        { included: true, text: "1 tin tuyển dụng trong 30 ngày" },
        { included: true, text: "Hiển thị trên trang chủ 3 ngày" },
        { included: true, text: "Tiếp cận không giới hạn ứng viên" },
        { included: true, text: "Quản lý hồ sơ ứng viên" },
        { included: false, text: "Đẩy tin tuyển dụng" },
        { included: false, text: "Hiển thị vị trí tuyển dụng nổi bật" },
        { included: false, text: "Tìm kiếm ứng viên" },
      ],
      popular: false,
    },
    {
      title: "Nâng cao",
      price: "2,500,000 VNĐ",
      duration: "30 ngày",
      features: [
        { included: true, text: "3 tin tuyển dụng trong 30 ngày" },
        { included: true, text: "Hiển thị trên trang chủ 7 ngày" },
        { included: true, text: "Tiếp cận không giới hạn ứng viên" },
        { included: true, text: "Quản lý hồ sơ ứng viên" },
        { included: true, text: "Đẩy tin tuyển dụng (7 ngày)" },
        { included: false, text: "Hiển thị vị trí tuyển dụng nổi bật" },
        { included: true, text: "Tìm kiếm ứng viên (giới hạn)" },
      ],
      popular: true,
    },
    {
      title: "Premium",
      price: "5,000,000 VNĐ",
      duration: "30 ngày",
      features: [
        { included: true, text: "5 tin tuyển dụng trong 30 ngày" },
        { included: true, text: "Hiển thị trên trang chủ 15 ngày" },
        { included: true, text: "Tiếp cận không giới hạn ứng viên" },
        { included: true, text: "Quản lý hồ sơ ứng viên" },
        { included: true, text: "Đẩy tin tuyển dụng (15 ngày)" },
        { included: true, text: "Hiển thị vị trí tuyển dụng nổi bật" },
        { included: true, text: "Tìm kiếm ứng viên (không giới hạn)" },
      ],
      popular: false,
    },
  ];

  const brandingFeatures = [
    {
      title: "Branding Cơ bản",
      price: "8,000,000 VNĐ",
      duration: "tháng",
      features: [
        { included: true, text: "Logo trên trang chủ (vị trí luân phiên)" },
        { included: true, text: "Banner quảng cáo trên trang Jobs" },
        { included: true, text: "Bài viết PR giới thiệu công ty" },
        { included: false, text: "Bài phỏng vấn HR/CEO" },
        { included: false, text: "Email marketing đến ứng viên" },
        { included: false, text: "Tài trợ sự kiện tuyển dụng" },
      ],
      popular: false,
    },
    {
      title: "Branding Pro",
      price: "15,000,000 VNĐ",
      duration: "tháng",
      features: [
        { included: true, text: "Logo trên trang chủ (vị trí cố định)" },
        { included: true, text: "Banner quảng cáo trên trang Jobs & Homepage" },
        { included: true, text: "Bài viết PR giới thiệu công ty" },
        { included: true, text: "Bài phỏng vấn HR/CEO" },
        { included: true, text: "Email marketing đến ứng viên" },
        { included: false, text: "Tài trợ sự kiện tuyển dụng" },
      ],
      popular: true,
    },
    {
      title: "Branding Enterprise",
      price: "Liên hệ",
      duration: "gói",
      features: [
        { included: true, text: "Logo trên trang chủ (vị trí đặc biệt)" },
        { included: true, text: "Banner quảng cáo trên toàn bộ website" },
        { included: true, text: "Bài viết PR giới thiệu công ty" },
        { included: true, text: "Bài phỏng vấn HR/CEO" },
        { included: true, text: "Email marketing đến ứng viên" },
        { included: true, text: "Tài trợ sự kiện tuyển dụng" },
      ],
      popular: false,
      buttonText: "Liên hệ tư vấn",
    },
  ];

  return (
    <Layout>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <DollarSign className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Bảng giá dịch vụ</h1>
            <p className="text-xl text-muted-foreground">
              Chọn gói dịch vụ phù hợp với nhu cầu tuyển dụng và quảng bá thương hiệu của doanh nghiệp bạn
            </p>
          </div>

          <Tabs defaultValue="recruitment" className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="recruitment">Dịch vụ tuyển dụng</TabsTrigger>
                <TabsTrigger value="branding">Dịch vụ quảng bá</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recruitment">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recruitmentFeatures.map((plan, index) => (
                  <PricingCard key={index} {...plan} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="branding">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {brandingFeatures.map((plan, index) => (
                  <PricingCard key={index} {...plan} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp</h2>
            
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 text-primary mr-2" />
                  Tôi có thể mua nhiều gói cùng lúc không?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Có, bạn có thể mua nhiều gói cùng lúc hoặc gia hạn gói hiện tại. Thời hạn sẽ được cộng dồn.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 text-primary mr-2" />
                  Có ưu đãi khi mua gói dài hạn không?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Có, chúng tôi cung cấp chiết khấu đặc biệt cho các gói 3 tháng, 6 tháng và năm. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 text-primary mr-2" />
                  Tôi có thể hủy gói bất cứ lúc nào không?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Bạn có thể hủy gói bất cứ lúc nào, tuy nhiên chúng tôi không hoàn lại phí cho thời gian còn lại của gói dịch vụ.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 text-primary mr-2" />
                  Phương thức thanh toán nào được chấp nhận?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay), và thẻ tín dụng/ghi nợ quốc tế.
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <Button size="lg">Liên hệ tư vấn</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
