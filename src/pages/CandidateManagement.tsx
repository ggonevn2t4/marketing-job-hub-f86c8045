
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Search, Users } from 'lucide-react';
import { useCandidateManagement } from '@/hooks/useCandidateManagement';
import CandidateFilters from '@/components/candidates/CandidateFilters';
import CandidateTabs from '@/components/candidates/CandidateTabs';

const CandidateManagement = () => {
  const navigate = useNavigate();
  const {
    allCandidates,
    savedCandidates,
    appliedCandidates,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterSkill,
    setFilterSkill,
    filterLocation,
    setFilterLocation,
    filterExperience,
    setFilterExperience,
    updateCandidateStatus,
    filterCandidates
  } = useCandidateManagement();

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" /> Quản lý ứng viên
            </h1>
            <p className="text-muted-foreground">
              Tìm kiếm, theo dõi và quản lý ứng viên tiềm năng cho công ty của bạn
            </p>
          </div>
          <Button onClick={() => navigate('/find-candidates')}>
            <Search className="h-4 w-4 mr-2" /> Tìm kiếm ứng viên
          </Button>
        </div>
        
        <CandidateFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterSkill={filterSkill}
          onSkillChange={setFilterSkill}
          filterLocation={filterLocation}
          onLocationChange={setFilterLocation}
          filterExperience={filterExperience}
          onExperienceChange={setFilterExperience}
        />
        
        <CandidateTabs
          allCandidates={allCandidates}
          savedCandidates={savedCandidates}
          appliedCandidates={appliedCandidates}
          isLoading={isLoading}
          onUpdateStatus={updateCandidateStatus}
          filterCandidates={filterCandidates}
        />
      </div>
    </Layout>
  );
};

export default CandidateManagement;
