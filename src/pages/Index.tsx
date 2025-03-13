
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/homepage/Hero';
import Stats from '@/components/homepage/Stats';
import Categories from '@/components/categories/Categories';
import CallToAction from '@/components/homepage/CallToAction';
import JobList from '@/components/jobs/JobList';
import Companies from '@/components/companies/Companies';
import { motion } from 'framer-motion';
import LinkButton from '@/components/custom/LinkButton';
import { fetchJobs, fetchCompanies } from '@/utils/supabaseQueries';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured jobs
        const { jobs } = await fetchJobs({
          limit: 6,
        });
        setFeaturedJobs(jobs);
        
        // Fetch featured companies
        const companies = await fetchCompanies(true, 6);
        setFeaturedCompanies(companies);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
            
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
              >
                <JobList 
                  jobs={featuredJobs} 
                  showLoadMore={false}
                />
              </motion.div>
            )}
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
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-16 w-16 rounded-lg mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
              >
                <Companies 
                  companies={featuredCompanies} 
                  showLoadMore={false}
                  showViewAll={true}
                />
              </motion.div>
            )}
          </motion.section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
