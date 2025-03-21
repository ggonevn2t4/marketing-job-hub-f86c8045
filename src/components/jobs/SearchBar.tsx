
import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCategories } from '@/utils/supabaseQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

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
    
    // Close filter sheet if it's open (mobile)
    if (isFilterSheetOpen) {
      setIsFilterSheetOpen(false);
    }
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

  const clearFilters = () => {
    setSearchTerm('');
    setLocationValue('');
    setCategory('');
  };

  // Mobile-optimized search form
  const renderMobileSearchForm = () => (
    <form onSubmit={handleSearch} className="w-full space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Vị trí, từ khóa..."
          className="pl-10 py-3 input-touch-friendly text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc
            </span>
            <Badge variant="secondary" className="ml-2">
              {(locationValue ? 1 : 0) + (category ? 1 : 0)}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
          <SheetHeader className="mb-6">
            <SheetTitle>Tìm kiếm nâng cao</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Địa điểm</label>
              <Select value={locationValue} onValueChange={setLocationValue}>
                <SelectTrigger className="w-full input-touch-friendly">
                  <SelectValue placeholder="Chọn địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa điểm</SelectItem>
                  {vietnamCities.map(city => (
                    <SelectItem key={city.value} value={city.value}>{city.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Ngành nghề</label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full input-touch-friendly">
                    <SelectValue placeholder="Chọn ngành nghề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả ngành nghề</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-8">
            <Button 
              type="submit" 
              onClick={(e) => {
                handleSearch(e);
                setIsFilterSheetOpen(false);
              }}
              className="button-touch-friendly"
            >
              Áp dụng bộ lọc
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                clearFilters();
              }}
              className="button-touch-friendly"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <Button type="submit" className="w-full py-3 button-touch-friendly">
        Tìm kiếm
      </Button>

      {(searchTerm || locationValue || category) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <Badge variant="secondary" className="text-sm py-1.5">
              Từ khóa: {searchTerm}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            </Badge>
          )}
          {locationValue && locationValue !== 'all' && (
            <Badge variant="secondary" className="text-sm py-1.5">
              Địa điểm: {locationValue}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setLocationValue('')}
              >
                ✕
              </button>
            </Badge>
          )}
          {category && category !== 'all' && (
            <Badge variant="secondary" className="text-sm py-1.5">
              Ngành nghề: {categories.find(c => c.id === category)?.name || category}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setCategory('')}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}
    </form>
  );

  // Desktop/tablet search form
  const renderDesktopSearchForm = () => (
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
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className={`grid grid-cols-1 ${isTablet ? 'grid-cols-2' : ''} md:grid-cols-2 gap-3 md:w-[50%]`}>
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

        <div className="flex gap-2">
          {(searchTerm || locationValue || category) && (
            <Button 
              type="button" 
              variant="outline" 
              className="py-6" 
              onClick={clearFilters}
            >
              Xóa
            </Button>
          )}
          <Button type="submit" className="py-6 px-8">Tìm kiếm</Button>
        </div>
      </div>

      {(searchTerm || locationValue || category) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <Badge variant="secondary" className="text-sm py-1.5">
              Từ khóa: {searchTerm}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            </Badge>
          )}
          {locationValue && locationValue !== 'all' && (
            <Badge variant="secondary" className="text-sm py-1.5">
              Địa điểm: {locationValue}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setLocationValue('')}
              >
                ✕
              </button>
            </Badge>
          )}
          {category && category !== 'all' && (
            <Badge variant="secondary" className="text-sm py-1.5">
              Chuyên ngành: {categories.find(c => c.id === category)?.name || category}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setCategory('')}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}
    </form>
  );

  return isMobile ? renderMobileSearchForm() : renderDesktopSearchForm();
};

export default SearchBar;
