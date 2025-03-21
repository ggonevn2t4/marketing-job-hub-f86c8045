
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CandidateEmptyStateProps {
  filterBy: 'all' | 'saved' | 'applied';
}

const CandidateEmptyState = ({ filterBy }: CandidateEmptyStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chưa có ứng viên nào</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            {filterBy === 'saved' 
              ? 'Bạn chưa lưu ứng viên nào.'
              : filterBy === 'applied'
              ? 'Chưa có ứng viên nào ứng tuyển vào vị trí của bạn.'
              : 'Không tìm thấy ứng viên nào.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateEmptyState;
