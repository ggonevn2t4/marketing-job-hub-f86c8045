
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

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
  // Các địa điểm để chọn
  const locations = [
    { value: "", label: "Tất cả địa điểm" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" }
  ];

  // Các mức kinh nghiệm để chọn
  const experiences = [
    { value: "", label: "Tất cả kinh nghiệm" },
    { value: "0", label: "Không có kinh nghiệm" },
    { value: "1", label: "Ít nhất 1 năm" },
    { value: "2", label: "Ít nhất 2 năm" },
    { value: "3", label: "Ít nhất 3 năm" },
    { value: "5", label: "Ít nhất 5 năm" }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Input
              placeholder="Tìm kiếm theo tên, email, thông tin..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filterLocation ? locations.find(loc => loc.value === filterLocation)?.label : "Địa điểm"}
                  <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                {locations.map((location) => (
                  <DropdownMenuItem 
                    key={location.value} 
                    onClick={() => onLocationChange(location.value)}
                    className={filterLocation === location.value ? "bg-muted" : ""}
                  >
                    {location.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {filterExperience ? experiences.find(exp => exp.value === filterExperience)?.label : "Kinh nghiệm"}
                  <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                {experiences.map((experience) => (
                  <DropdownMenuItem 
                    key={experience.value} 
                    onClick={() => onExperienceChange(experience.value)}
                    className={filterExperience === experience.value ? "bg-muted" : ""}
                  >
                    {experience.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-4 relative">
          <Input
            placeholder="Kỹ năng (ví dụ: Marketing, SEO, Content Writing...)"
            value={filterSkill}
            onChange={(e) => onSkillChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateFilters;
