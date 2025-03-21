
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface CandidateFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterSkill: string;
  onSkillChange: (value: string) => void;
  filterLocation: string;
  onLocationChange: (value: string) => void;
  filterExperience: string;
  onExperienceChange: (value: string) => void;
}

const CandidateFilters = ({
  searchTerm,
  onSearchChange,
  filterSkill,
  onSkillChange,
  filterLocation,
  onLocationChange,
  filterExperience,
  onExperienceChange
}: CandidateFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Tìm kiếm theo tên, email, thông tin..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filterLocation} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả địa điểm</SelectItem>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filterExperience} onValueChange={onExperienceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Kinh nghiệm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả kinh nghiệm</SelectItem>
                <SelectItem value="0">Không có kinh nghiệm</SelectItem>
                <SelectItem value="1">Ít nhất 1 năm</SelectItem>
                <SelectItem value="2">Ít nhất 2 năm</SelectItem>
                <SelectItem value="3">Ít nhất 3 năm</SelectItem>
                <SelectItem value="5">Ít nhất 5 năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <Input
            placeholder="Kỹ năng (ví dụ: Marketing, SEO, Content Writing...)"
            value={filterSkill}
            onChange={(e) => onSkillChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateFilters;
