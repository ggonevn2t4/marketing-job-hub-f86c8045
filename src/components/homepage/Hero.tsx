
import { motion } from "framer-motion";
import SearchBar from '../jobs/SearchBar';

const Hero = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <span className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Kết nối nhân tài Marketing với nhà tuyển dụng hàng đầu
            </span>
          </motion.div>

          <motion.h1 
            variants={item} 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Tìm kiếm công việc <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Marketing</span> mơ ước của bạn
          </motion.h1>

          <motion.p 
            variants={item} 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Khám phá hàng ngàn cơ hội việc làm Marketing, Digital Marketing, và Social Media từ Junior đến Director tại các công ty hàng đầu Việt Nam.
          </motion.p>

          <motion.div 
            variants={item}
            className="pt-4"
          >
            <SearchBar />
          </motion.div>

          <motion.div 
            variants={item}
            className="text-muted-foreground text-sm flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4"
          >
            <span>Tìm kiếm phổ biến:</span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a href="/jobs?q=digital+marketing" className="hover:text-primary transition-colors">Digital Marketing</a>
              <a href="/jobs?q=content+writer" className="hover:text-primary transition-colors">Content Writer</a>
              <a href="/jobs?q=social+media" className="hover:text-primary transition-colors">Social Media</a>
              <a href="/jobs?q=marketing+manager" className="hover:text-primary transition-colors">Marketing Manager</a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
