
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/homepage/Hero';
import Stats from '@/components/homepage/Stats';
import Categories from '@/components/categories/Categories';
import CallToAction from '@/components/homepage/CallToAction';
import JobList from '@/components/jobs/JobList';
import Companies from '@/components/companies/Companies';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LinkButton from '@/components/custom/LinkButton';

const sampleJobs = [
  {
    id: '1',
    title: 'Digital Marketing Manager',
    company: 'Tech Solutions',
    logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'TP. Hồ Chí Minh',
    salary: '25 - 35 triệu VND',
    jobType: 'Toàn thời gian',
    experienceLevel: '3 - 5 năm',
    postedAt: '2 ngày trước',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Content Marketing Specialist',
    company: 'Creative Agency',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Hà Nội',
    salary: '15 - 20 triệu VND',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '1 ngày trước',
    isHot: true
  },
  {
    id: '3',
    title: 'SEO/SEM Specialist',
    company: 'Digital World',
    logo: 'https://images.unsplash.com/photo-1614036546595-c2c98daa7666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Đà Nẵng',
    salary: '18 - 22 triệu VND',
    jobType: 'Toàn thời gian',
    experienceLevel: '2 - 4 năm',
    postedAt: '3 ngày trước'
  },
  {
    id: '4',
    title: 'Social Media Manager',
    company: 'Brand Connect',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'TP. Hồ Chí Minh',
    salary: '20 - 25 triệu VND',
    jobType: 'Toàn thời gian',
    experienceLevel: '2 - 4 năm',
    postedAt: '4 ngày trước',
    isUrgent: true
  },
  {
    id: '5',
    title: 'Email Marketing Specialist',
    company: 'E-Commerce Pro',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Hà Nội',
    salary: '15 - 18 triệu VND',
    jobType: 'Toàn thời gian',
    experienceLevel: '1 - 3 năm',
    postedAt: '5 ngày trước'
  },
  {
    id: '6',
    title: 'Marketing Director',
    company: 'Global Innovations',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'TP. Hồ Chí Minh',
    salary: '50 - 70 triệu VND',
    jobType: 'Toàn thời gian',
    experienceLevel: '7+ năm',
    postedAt: '1 tuần trước',
    isFeatured: true
  }
];

const sampleCompanies = [
  {
    id: '1',
    name: 'Tech Solutions',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'TP. Hồ Chí Minh',
    industry: 'Công nghệ',
    jobCount: 12,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Creative Agency',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Hà Nội',
    industry: 'Creative',
    jobCount: 8,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Digital World',
    logo: 'https://images.unsplash.com/photo-1614036546595-c2c98daa7666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Đà Nẵng',
    industry: 'Digital',
    jobCount: 5
  },
  {
    id: '4',
    name: 'Brand Connect',
    logo: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'TP. Hồ Chí Minh',
    industry: 'Branding',
    jobCount: 7
  },
  {
    id: '5',
    name: 'E-Commerce Pro',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'Hà Nội',
    industry: 'E-Commerce',
    jobCount: 4
  },
  {
    id: '6',
    name: 'Global Innovations',
    logo: 'https://images.unsplash.com/photo-1614036546595-c2c98daa7666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    location: 'TP. Hồ Chí Minh',
    industry: 'Innovation',
    jobCount: 9,
    isFeatured: true
  }
];

const Index = () => {
  // Import the framer-motion library
  useEffect(() => {
    const loadFramerMotion = async () => {
      try {
        await import('framer-motion');
      } catch (err) {
        console.error('Failed to load framer-motion:', err);
      }
    };
    
    loadFramerMotion();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      } 
    }
  };

  return (
    <Layout>
      <Hero />
      
      <div className="py-16">
        <div className="container mx-auto px-6">
          <Stats />
          
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
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
          
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="py-16"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="mb-6 md:mb-0">
                <motion.span 
                  className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                >
                  Việc làm nổi bật
                </motion.span>
                <motion.h2 
                  className="text-3xl font-bold"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
                  }}
                >
                  Cơ hội việc làm Marketing mới nhất
                </motion.h2>
              </div>
              
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 10 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
                }}
              >
                <LinkButton 
                  href="/jobs" 
                  variant="outline"
                  showArrow
                >
                  Xem tất cả việc làm
                </LinkButton>
              </motion.div>
            </div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              <JobList 
                jobs={sampleJobs} 
                showLoadMore={false}
              />
            </motion.div>
          </motion.section>
          
          <CallToAction />
          
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
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
                Nhà tuyển dụng
              </motion.span>
              <motion.h2 
                className="text-3xl font-bold mb-4"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
                }}
              >
                Công ty tuyển dụng Marketing hàng đầu
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
                }}
              >
                Khám phá cơ hội việc làm tại các công ty tuyển dụng hàng đầu trong lĩnh vực Marketing
              </motion.p>
            </div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              <Companies 
                companies={sampleCompanies} 
                showLoadMore={false}
                showViewAll={true}
              />
            </motion.div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
