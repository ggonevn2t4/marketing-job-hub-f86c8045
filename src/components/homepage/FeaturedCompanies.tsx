
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BuildingIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Companies from '@/components/companies/Companies';
import { fetchCompanies } from '@/utils/supabaseQueries';

const FeaturedCompanies = () => {
  const [featuredCompanies, setFeaturedCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured companies
        const companies = await fetchCompanies(true, 6);
        setFeaturedCompanies(companies);
        
      } catch (error) {
        console.error('Error fetching featured companies:', error);
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
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.div
          className="flex justify-center mb-4"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1.5 text-sm font-medium rounded-full">
            <BuildingIcon size={14} className="mr-1" /> Nhà tuyển dụng hàng đầu
          </Badge>
        </motion.div>
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
          className="mt-6"
        >
          <Companies 
            companies={featuredCompanies} 
            showLoadMore={false}
            showViewAll={true}
          />
        </motion.div>
      )}
    </motion.section>
  );
};

export default FeaturedCompanies;
