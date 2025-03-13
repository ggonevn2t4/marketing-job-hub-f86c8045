
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { User, Briefcase, Building2, FileText, Info, Mail, CheckSquare, Shield, FileCode } from 'lucide-react';

const Sitemap = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const sections = [
    {
      title: "Việc làm",
      icon: <Briefcase className="h-5 w-5" />,
      links: [
        { name: "Tìm việc làm", url: "/jobs" },
        { name: "Việc làm đã lưu", url: "/saved-jobs" },
        { name: "Quản lý đơn ứng tuyển", url: "/application-tracker" },
        { name: "Lịch sử ứng tuyển", url: "/application-tracker" }
      ]
    },
    {
      title: "Công ty",
      icon: <Building2 className="h-5 w-5" />,
      links: [
        { name: "Danh sách công ty", url: "/companies" },
        { name: "Đăng tin tuyển dụng", url: "/post-job" },
        { name: "Quản lý đơn ứng tuyển", url: "/manage-applications" }
      ]
    },
    {
      title: "Tài khoản",
      icon: <User className="h-5 w-5" />,
      links: [
        { name: "Đăng nhập / Đăng ký", url: "/auth" },
        { name: "Hồ sơ cá nhân", url: "/profile" },
        { name: "Hồ sơ công ty", url: "/company-profile" }
      ]
    },
    {
      title: "Kiến thức",
      icon: <FileText className="h-5 w-5" />,
      links: [
        { name: "Blog & Kiến thức", url: "/blog" },
        { name: "Thông tin lương", url: "/salary" },
        { name: "Tài nguyên tuyển dụng", url: "/employer/resources" }
      ]
    },
    {
      title: "Về chúng tôi",
      icon: <Info className="h-5 w-5" />,
      links: [
        { name: "Giới thiệu", url: "/about" },
        { name: "Liên hệ", url: "/contact" },
        { name: "Bảng giá dịch vụ", url: "/employer/pricing" }
      ]
    },
    {
      title: "Pháp lý",
      icon: <Shield className="h-5 w-5" />,
      links: [
        { name: "Chính sách riêng tư", url: "/privacy" },
        { name: "Điều khoản sử dụng", url: "/terms" }
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Sơ đồ trang</h1>
            <p className="text-muted-foreground">
              Danh sách tất cả các trang trên TopMarketingJobs
            </p>
          </div>

          <Separator className="mb-10" />

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {sections.map((section, index) => (
              <motion.div key={index} className="space-y-4" variants={item}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <ul className="space-y-3 ml-10">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.url}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 bg-primary/70 rounded-full"></div>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 text-center">
            <FileCode className="h-12 w-12 mx-auto text-primary/50 mb-4" />
            <p className="text-muted-foreground">
              Không tìm thấy những gì bạn đang tìm kiếm?{' '}
              <Link to="/contact" className="text-primary hover:underline">
                Liên hệ với chúng tôi.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sitemap;
