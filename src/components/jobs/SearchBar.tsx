
import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCategories } from '@/utils/supabaseQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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
    if (locationValue && locationValue !== 'all') params.set('location', locationValue);
    if (category && category !== 'all') params.set('category', category);
    
    navigate(`/jobs?${params.toString()}`);
  };

  // List of major Vietnamese cities
  const vietnamCities = [
    { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
    { value: 'Hà Nội', label: 'Hà Nội' },
    { value: 'Đà Nẵng', label: 'Đà Nẵng' },
    { value: 'Cần Thơ', label: 'Cần Thơ' },
    { value: 'Hải Phòng', label: 'Hải Phòng' },
    { value: 'Nha Trang', label: 'Nha Trang' },
    { value: 'Huế', label: 'Huế' },
    { value: 'Quảng Ninh', label: 'Quảng Ninh' },
    { value: 'Bình Dương', label: 'Bình Dương' },
    { value: 'Đồng Nai', label: 'Đồng Nai' },
  ];

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
        
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-3 md:w-[50%]`}>
          <div className="relative">
            <Select value={locationValue} onValueChange={setLocationValue}>
              <SelectTrigger className="py-6 pl-10">
                <SelectValue placeholder="Địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả địa điểm</SelectItem>
                {vietnamCities.map(city => (
                  <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
          </div>
          
          {loading ? (
            <Skeleton className="h-[42px]" />
          ) : (
            <div className="relative">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="py-6 pl-10">
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
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
            </div>
          )}
        </div>

        <Button type="submit" className="py-6 px-8">Tìm kiếm</Button>
      </div>
    </form>
  );
};

export default SearchBar;
