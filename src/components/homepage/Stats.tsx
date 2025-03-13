
import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { label: 'Việc làm Marketing', value: '5,300+' },
  { label: 'Nhà tuyển dụng hàng đầu', value: '750+' },
  { label: 'Ứng viên đã ứng tuyển', value: '45,000+' },
  { label: 'Ứng viên được tuyển dụng', value: '12,500+' },
];

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <div ref={ref} className="bg-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={hasAnimated ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
                >
                  {stat.value}
                </motion.span>
                <span className="text-muted-foreground">{stat.label}</span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
