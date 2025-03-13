
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCategories } from '@/utils/supabaseQueries';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get query params from URL if on search page
  useEffect(() => {
    if (location.pathname === '/jobs') {
      const params = new URLSearchParams(location.search);
      setSearchTerm(params.get('q') || '');
      setLocationValue(params.get('location') || '');
      setCategory(params.get('category') || '');
    }
  }, [location]);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (locationValue) params.set('location', locationValue);
    if (category) params.set('category', category);
    
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="bg-card rounded-xl shadow-md p-3 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Vị trí, từ khóa..."
            className="pl-10 py-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:w-[50%]">
          <Select value={locationValue} onValueChange={setLocationValue}>
            <SelectTrigger className="py-6">
              <SelectValue placeholder="Địa điểm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả địa điểm</SelectItem>
              <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
          
          {loading ? (
            <Skeleton className="h-[42px]" />
          ) : (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="py-6">
                <SelectValue placeholder="Chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chuyên ngành</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button type="submit" className="py-6 px-8">Tìm kiếm</Button>
      </div>
    </form>
  );
};

export default SearchBar;
