
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Gửi tin nhắn thành công!",
        description: "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-transparent pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Liên hệ với chúng tôi</h1>
            <p className="text-xl text-muted-foreground">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ ngay!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Số điện thoại
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tiêu đề tin nhắn"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Nội dung tin nhắn <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Nhập nội dung tin nhắn của bạn"
                  className="min-h-[150px]"
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
              </Button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Địa chỉ</h3>
                    <p className="text-muted-foreground">Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Điện thoại</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:0708684608" className="hover:text-primary transition-colors">
                        0708684608
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:contact@topmarketingjobs.vn" className="hover:text-primary transition-colors">
                        contact@topmarketingjobs.vn
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Giờ làm việc</h3>
                    <p className="text-muted-foreground">
                      Thứ 2 - Thứ 6: 8:30 - 18:00<br />
                      Thứ 7: 8:30 - 12:00<br />
                      Chủ nhật: Nghỉ
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Vị trí của chúng tôi</h3>
                  <div className="aspect-video rounded-md overflow-hidden border">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2348188722274!2d106.7183985767109!3d10.795383061607058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527c2f8f30911%3A0x36dc59f00a5c37db!2sLandmark%2081!5e0!3m2!1sen!2s!4v1689925321201!5m2!1sen!2s" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
