
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X, FilterX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface FiltersProps {
  filters: {
    jobType?: string;
    experienceLevel?: string;
    salary?: string;
    salaryRange?: [number, number];
    featuredOnly?: boolean;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

const AdvancedFilters = ({ filters, onFilterChange, onReset }: FiltersProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [salarySliderValue, setSalarySliderValue] = useState<[number, number]>(
    filters.salaryRange || [0, 50]
  );
  const isMobile = useIsMobile();
  
  const jobTypes = [
    { value: 'Toàn thời gian', label: 'Toàn thời gian' },
    { value: 'Bán thời gian', label: 'Bán thời gian' },
    { value: 'Thực tập', label: 'Thực tập' },
    { value: 'Làm việc từ xa', label: 'Làm việc từ xa' },
    { value: 'Hợp đồng', label: 'Hợp đồng' },
  ];
  
  const experienceLevels = [
    { value: 'Mới tốt nghiệp', label: 'Mới tốt nghiệp' },
    { value: 'Dưới 1 năm', label: 'Dưới 1 năm' },
    { value: '1-3 năm', label: '1-3 năm' },
    { value: '3-5 năm', label: '3-5 năm' },
    { value: '5+ năm', label: '5+ năm' },
    { value: 'Cấp quản lý', label: 'Cấp quản lý' },
  ];
  
  const handleJobTypeChange = (value: string) => {
    const newFilters = { ...filters, jobType: value };
    onFilterChange(newFilters);
    
    // Cập nhật active filters
    updateActiveFilters('jobType', value);
  };
  
  const handleExperienceChange = (value: string) => {
    const newFilters = { ...filters, experienceLevel: value };
    onFilterChange(newFilters);
    
    // Cập nhật active filters
    updateActiveFilters('experienceLevel', value);
  };
  
  const handleSalaryChange = (values: number[]) => {
    setSalarySliderValue([values[0], values[1]]);
    
    // Chỉ cập nhật filter khi người dùng thả chuột
    const minSalary = values[0];
    const maxSalary = values[1];
    
    const salaryDisplay = `${minSalary}-${maxSalary} triệu`;
    const newFilters = { 
      ...filters, 
      salary: salaryDisplay,
      salaryRange: [minSalary, maxSalary]
    };
    
    onFilterChange(newFilters);
    
    // Cập nhật active filters
    updateActiveFilters('salary', salaryDisplay);
  };
  
  const handleFeaturedChange = (checked: boolean) => {
    const newFilters = { ...filters, featuredOnly: checked };
    onFilterChange(newFilters);
    
    // Cập nhật active filters
    if (checked) {
      setActiveFilters(prev => [...prev, 'featuredOnly']);
    } else {
      setActiveFilters(prev => prev.filter(f => f !== 'featuredOnly'));
    }
  };
  
  const updateActiveFilters = (filterName: string, value: string | null) => {
    if (!value) {
      setActiveFilters(prev => prev.filter(f => f !== filterName));
    } else if (!activeFilters.includes(filterName)) {
      setActiveFilters(prev => [...prev, filterName]);
    }
  };
  
  const removeFilter = (filterName: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterName as keyof typeof filters];
    onFilterChange(newFilters);
    
    // Cập nhật active filters
    setActiveFilters(prev => prev.filter(f => f !== filterName));
  };
  
  const handleReset = () => {
    onReset();
    setActiveFilters([]);
    setSalarySliderValue([0, 50]);
  };
  
  const getFilterLabel = (filterName: string) => {
    switch (filterName) {
      case 'jobType':
        return `Loại công việc: ${filters.jobType}`;
      case 'experienceLevel':
        return `Kinh nghiệm: ${filters.experienceLevel}`;
      case 'salary':
        return `Mức lương: ${filters.salary}`;
      case 'featuredOnly':
        return 'Tin nổi bật';
      default:
        return '';
    }
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold">Bộ lọc nâng cao</h3>
          
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-8" onClick={handleReset}>
              <FilterX size={14} className="mr-1" />
              Xóa bộ lọc
            </Button>
          )}
        </div>
        
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {getFilterLabel(filter)}
                <X
                  size={14}
                  className="cursor-pointer ml-1"
                  onClick={() => removeFilter(filter)}
                />
              </Badge>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Loại công việc</Label>
            <RadioGroup value={filters.jobType} onValueChange={handleJobTypeChange}>
              {jobTypes.map(type => (
                <div key={type.value} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={type.value} id={`job-type-${type.value}`} />
                  <Label htmlFor={`job-type-${type.value}`} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Kinh nghiệm</Label>
            <RadioGroup value={filters.experienceLevel} onValueChange={handleExperienceChange}>
              {experienceLevels.map(level => (
                <div key={level.value} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={level.value} id={`exp-level-${level.value}`} />
                  <Label htmlFor={`exp-level-${level.value}`} className="cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Mức lương (triệu VNĐ)</Label>
            <div className="px-3 pt-6 pb-2">
              <Slider
                defaultValue={salarySliderValue}
                max={50}
                step={1}
                value={salarySliderValue}
                onValueChange={handleSalaryChange}
                className="mb-4"
              />
              <div className="flex items-center justify-between">
                <div className="w-16">
                  <Input
                    type="number"
                    value={salarySliderValue[0]}
                    min={0}
                    max={salarySliderValue[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value <= salarySliderValue[1]) {
                        handleSalaryChange([value, salarySliderValue[1]]);
                      }
                    }}
                    className="h-8 px-2"
                  />
                </div>
                <span>-</span>
                <div className="w-16">
                  <Input
                    type="number"
                    value={salarySliderValue[1]}
                    min={salarySliderValue[0]}
                    max={50}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value >= salarySliderValue[0]) {
                        handleSalaryChange([salarySliderValue[0], value]);
                      }
                    }}
                    className="h-8 px-2"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {salarySliderValue[0]} - {salarySliderValue[1]} triệu VNĐ
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">Tùy chọn khác</Label>
            <div className="flex items-center space-x-2 py-1">
              <Checkbox 
                id="featured-only" 
                checked={filters.featuredOnly || false}
                onCheckedChange={handleFeaturedChange}
              />
              <Label htmlFor="featured-only" className="cursor-pointer">
                Chỉ hiển thị tin nổi bật
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
