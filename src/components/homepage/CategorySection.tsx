
import { motion } from 'framer-motion';
import Categories from '@/components/categories/Categories';

const CategorySection = () => {
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
        <motion.span 
          className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          Khám phá ngành nghề
        </motion.span>
        <motion.h2 
          className="text-3xl font-bold mb-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
          }}
        >
          Việc làm Marketing theo chuyên ngành
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
          }}
        >
          Khám phá cơ hội việc làm theo lĩnh vực Marketing mà bạn quan tâm
        </motion.p>
      </div>
      
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <Categories />
      </motion.div>
    </motion.section>
  );
};

export default CategorySection;
