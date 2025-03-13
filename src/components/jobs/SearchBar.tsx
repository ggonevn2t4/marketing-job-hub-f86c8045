
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase } from 'lucide-react';

const SearchBar = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct query parameters
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    
    // Navigate to jobs page with search params
    navigate({
      pathname: '/jobs',
      search: params.toString()
    });
  };
  
  // Marketing job categories
  const categories = [
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'content-marketing', label: 'Content Marketing' },
    { value: 'social-media', label: 'Social Media Marketing' },
    { value: 'seo-sem', label: 'SEO/SEM' },
    { value: 'email-marketing', label: 'Email Marketing' },
    { value: 'brand-marketing', label: 'Brand Marketing' },
    { value: 'analytics', label: 'Marketing Analytics' },
    { value: 'tiktok-marketing', label: 'TikTok Marketing' },
    { value: 'facebook-ads', label: 'Facebook Ads' },
    { value: 'google-ads', label: 'Google Ads' },
  ];
  
  // Popular locations
  const locations = [
    { value: 'ho-chi-minh', label: 'TP. Hồ Chí Minh' },
    { value: 'ha-noi', label: 'Hà Nội' },
    { value: 'da-nang', label: 'Đà Nẵng' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
  ];
  
  return (
    <form onSubmit={handleSearch} className="w-full bg-white rounded-2xl shadow-lg p-6 border transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <div className="flex items-center h-full border rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="Tên công việc, kỹ năng, từ khóa..."
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex items-center h-full border rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="border-0 focus:ring-0 p-0 h-full">
                <SelectValue placeholder="Địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả địa điểm</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex items-center h-full border rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Briefcase className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-0 focus:ring-0 p-0 h-full">
                <SelectValue placeholder="Chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả chuyên ngành</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Button type="submit" className="w-full h-full">
            Tìm kiếm
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
