
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', { searchTerm, location, category });
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
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="py-6">
              <SelectValue placeholder="Địa điểm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả địa điểm</SelectItem>
              <SelectItem value="ho-chi-minh">TP. Hồ Chí Minh</SelectItem>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="danang">Đà Nẵng</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="py-6">
              <SelectValue placeholder="Chuyên ngành" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên ngành</SelectItem>
              <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
              <SelectItem value="content-marketing">Content Marketing</SelectItem>
              <SelectItem value="social-media">Social Media</SelectItem>
              <SelectItem value="seo-sem">SEO/SEM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="py-6 px-8">Tìm kiếm</Button>
      </div>
    </form>
  );
};

export default SearchBar;
