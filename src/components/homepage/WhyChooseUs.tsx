
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BriefcaseIcon, BuildingIcon, AwardIcon, TrendingUpIcon } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6,
            staggerChildren: 0.2
          } 
        }
      }}
      className="py-16"
    >
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          className="flex justify-center mb-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium rounded-full">
            <TrendingUpIcon size={14} className="mr-1" /> Tại sao chọn chúng tôi
          </Badge>
        </motion.div>
        <motion.h2 
          className="text-3xl font-bold mb-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
          }}
        >
          Giải pháp tuyển dụng Marketing toàn diện
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
          }}
        >
          Chúng tôi kết nối nhân tài Marketing với nhà tuyển dụng hàng đầu
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <BriefcaseIcon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Việc làm chất lượng cao</h3>
              <p className="text-muted-foreground">
                Tuyển chọn các cơ hội việc làm Marketing từ các công ty hàng đầu với mức lương cạnh tranh.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
          }}
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <BuildingIcon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Nhà tuyển dụng hàng đầu</h3>
              <p className="text-muted-foreground">
                Hợp tác với các doanh nghiệp và thương hiệu uy tín hàng đầu trong nhiều lĩnh vực.
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
          }}
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6">
                <AwardIcon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Hỗ trợ chuyên nghiệp</h3>
              <p className="text-muted-foreground">
                Quy trình ứng tuyển đơn giản, minh bạch và được hỗ trợ trong suốt quá trình tìm việc.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChooseUs;
