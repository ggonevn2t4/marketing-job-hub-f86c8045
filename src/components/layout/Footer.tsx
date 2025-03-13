
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              TopMarketingJobs
            </h3>
            <p className="text-muted-foreground">
              Kết nối nhân tài Marketing với các cơ hội việc làm hàng đầu trong ngành.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Khám phá</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-muted-foreground hover:text-primary transition-colors">
                  Danh sách công ty
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Bài viết & Kiến thức
                </Link>
              </li>
              <li>
                <Link to="/salary" className="text-muted-foreground hover:text-primary transition-colors">
                  Thông tin lương
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Nhà tuyển dụng</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/employer/post-job" className="text-muted-foreground hover:text-primary transition-colors">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/employer/find-talent" className="text-muted-foreground hover:text-primary transition-colors">
                  Tìm ứng viên
                </Link>
              </li>
              <li>
                <Link to="/employer/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Bảng giá dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/employer/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Tài nguyên tuyển dụng
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="hover:text-primary transition-colors">
                  Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} className="flex-shrink-0" />
                <a href="tel:0708684608" className="hover:text-primary transition-colors">
                  0708684608
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <a href="mailto:contact@topmarketingjobs.vn" className="hover:text-primary transition-colors">
                  contact@topmarketingjobs.vn
                </a>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Đăng ký nhận thông tin</h5>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email của bạn" 
                  className="rounded-lg px-3 py-2 text-sm bg-background border flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm">Gửi</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border text-sm text-muted-foreground">
          <p>© 2023 TopMarketingJobs. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Chính sách riêng tư
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
