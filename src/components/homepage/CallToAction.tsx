
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <div className="bg-gradient-to-b from-secondary/50 to-background py-24">
      <div className="container mx-auto px-6">
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden bg-white border shadow-xl">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/5 rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                  Dành cho nhà tuyển dụng
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Tiếp cận nhân tài Marketing tốt nhất cho doanh nghiệp của bạn
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Đăng tin tuyển dụng và tiếp cận hàng ngàn chuyên gia Marketing chất lượng cao. Chúng tôi giúp bạn tìm đúng người cho vị trí cần tuyển.
                </p>

                <div className="space-y-4">
                  {[
                    'Tiếp cận nhân tài Marketing chuyên nghiệp',
                    'Công cụ sàng lọc và tìm kiếm ứng viên thông minh',
                    'Nền tảng tuyển dụng chuyên biệt cho ngành Marketing',
                    'Thời gian tuyển dụng nhanh hơn 60%'
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Button size="lg" className="rounded-full">
                    Đăng tin tuyển dụng
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border overflow-hidden shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                  alt="Recruiting dashboard" 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
