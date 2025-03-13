
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import CompanyList from '@/components/companies/Companies';
import { CompanyProps } from '@/components/companies/CompanyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState<CompanyProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('companies')
          .select(`
            id,
            name,
            logo,
            location,
            industry,
            is_featured,
            jobs:jobs(id)
          `);
        
        // Add search filter if query exists
        const searchQuery = searchParams.get('q');
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        // Order by featured and name
        query = query.order('is_featured', { ascending: false })
                     .order('name', { ascending: true });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          // Format data for CompanyList component
          const formattedCompanies = data.map(company => ({
            id: company.id,
            name: company.name,
            logo: company.logo || '/placeholder.svg',
            location: company.location || 'Việt Nam',
            industry: company.industry || 'Marketing',
            jobCount: Array.isArray(company.jobs) ? company.jobs.length : 0,
            isFeatured: company.is_featured
          }));
          
          setCompanies(formattedCompanies);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        toast({
          title: 'Lỗi',
          description: 'Có lỗi xảy ra khi tải danh sách công ty',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanies();
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl font-bold mb-3">Nhà tuyển dụng hàng đầu</h1>
          <p className="text-muted-foreground mb-8">
            Khám phá các công ty tuyển dụng hàng đầu trong lĩnh vực Marketing và tìm kiếm cơ hội nghề nghiệp lý tưởng
          </p>
          
          <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto gap-2">
            <div className="flex flex-1 items-center h-full border rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="text"
                placeholder="Tìm kiếm công ty..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : companies.length > 0 ? (
          <CompanyList 
            companies={companies}
            showLoadMore={true}
            initialItems={12}
            showViewAll={false}
          />
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Không tìm thấy công ty phù hợp</h3>
            <p className="text-muted-foreground mb-6">
              Hãy thử thay đổi từ khóa tìm kiếm của bạn
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Companies;
