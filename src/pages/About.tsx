
import Layout from '@/components/layout/Layout';
import { Building2, Users, BarChart, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const About = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-transparent pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-6"
            >
              Về TopMarketingJobs
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Nền tảng kết nối nhân tài Marketing với các cơ hội việc làm hàng đầu trong ngành
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Sứ mệnh của chúng tôi</h2>
            <p className="text-muted-foreground mb-6">
              TopMarketingJobs ra đời với sứ mệnh xây dựng cầu nối giữa các doanh nghiệp và những 
              chuyên gia Marketing tài năng tại Việt Nam. Chúng tôi cung cấp nền tảng tuyển dụng 
              chuyên biệt, giúp các công ty tiếp cận đúng người cho vị trí cần tuyển và giúp các 
              ứng viên tìm được công việc phù hợp với năng lực, đam mê của mình.
            </p>
            <p className="text-muted-foreground">
              Với đội ngũ có nhiều năm kinh nghiệm trong lĩnh vực Marketing và tuyển dụng, 
              chúng tôi hiểu rõ những thách thức mà cả nhà tuyển dụng và ứng viên phải đối mặt. 
              Từ đó, chúng tôi không ngừng cải tiến nền tảng để mang đến trải nghiệm tốt nhất cho 
              người dùng.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
              alt="Marketing team meeting" 
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>

        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-muted-foreground">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Lấy người dùng làm trung tâm",
                description: "Chúng tôi luôn đặt trải nghiệm và lợi ích của nhà tuyển dụng và ứng viên lên hàng đầu."
              },
              {
                icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
                title: "Chất lượng",
                description: "Chúng tôi cam kết mang đến những cơ hội việc làm chất lượng và ứng viên phù hợp."
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Chuyên nghiệp",
                description: "Đội ngũ của chúng tôi làm việc với tinh thần trách nhiệm và chuyên nghiệp cao nhất."
              },
              {
                icon: <BarChart className="h-10 w-10 text-primary" />,
                title: "Đổi mới",
                description: "Chúng tôi không ngừng cải tiến nền tảng và dịch vụ để đáp ứng nhu cầu thị trường."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{value.icon}</div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-muted-foreground">
              Những người đứng sau TopMarketingJobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn Anh",
                position: "Đồng sáng lập & CEO",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              },
              {
                name: "Trần Minh Hiếu",
                position: "Giám đốc Marketing",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              },
              {
                name: "Lê Thị Hương",
                position: "Trưởng phòng Nhân sự",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 overflow-hidden rounded-xl mx-auto" style={{ maxWidth: '200px' }}>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Bạn có thắc mắc hoặc muốn hợp tác với TopMarketingJobs? Đừng ngần ngại liên hệ với chúng tôi!
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <a href="/contact" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Liên hệ ngay
            </a>
            <a href="tel:0708684608" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors">
              Gọi: 0708684608
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
