
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Bookmark, Building } from 'lucide-react';
import CandidateManagementTable from './CandidateManagementTable';
import { CandidateWithStatus } from '@/hooks/useCandidateManagement';

interface CandidateTabsProps {
  allCandidates: CandidateWithStatus[];
  savedCandidates: CandidateWithStatus[];
  appliedCandidates: CandidateWithStatus[];
  isLoading: boolean;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  filterCandidates: (candidates: CandidateWithStatus[]) => CandidateWithStatus[];
}

const CandidateTabs = ({
  allCandidates,
  savedCandidates,
  appliedCandidates,
  isLoading,
  onUpdateStatus,
  filterCandidates
}: CandidateTabsProps) => {
  const filteredAll = filterCandidates(allCandidates);
  const filteredSaved = filterCandidates(savedCandidates);
  const filteredApplied = filterCandidates(appliedCandidates);

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all" className="gap-2">
          <Users className="h-4 w-4" /> Tất cả ứng viên ({filteredAll.length})
        </TabsTrigger>
        <TabsTrigger value="saved" className="gap-2">
          <Bookmark className="h-4 w-4" /> Đã lưu ({filteredSaved.length})
        </TabsTrigger>
        <TabsTrigger value="applied" className="gap-2">
          <Building className="h-4 w-4" /> Đã ứng tuyển ({filteredApplied.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <CandidateManagementTable 
          candidates={filteredAll}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          filterBy="all"
        />
      </TabsContent>
      
      <TabsContent value="saved">
        <CandidateManagementTable 
          candidates={filteredSaved}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          filterBy="saved"
        />
      </TabsContent>
      
      <TabsContent value="applied">
        <CandidateManagementTable 
          candidates={filteredApplied}
          isLoading={isLoading}
          onUpdateStatus={onUpdateStatus}
          filterBy="applied"
        />
      </TabsContent>
    </Tabs>
  );
};

export default CandidateTabs;
