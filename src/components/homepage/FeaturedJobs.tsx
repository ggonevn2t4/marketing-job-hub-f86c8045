
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AwardIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import JobList from '@/components/jobs/JobList';
import LinkButton from '@/components/custom/LinkButton';
import { fetchJobs } from '@/utils/supabaseQueries';

const FeaturedJobs = () => {
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured jobs
        const { jobs } = await fetchJobs({
          limit: 6,
        });
        setFeaturedJobs(jobs);
        
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div className="mb-6 md:mb-0">
          <motion.div
            className="flex items-center gap-2 mb-4"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-4 py-1.5 text-sm font-medium rounded-full">
              <AwardIcon size={14} className="mr-1" /> Việc làm nổi bật
            </Badge>
          </motion.div>
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
  );
};

export default FeaturedJobs;
