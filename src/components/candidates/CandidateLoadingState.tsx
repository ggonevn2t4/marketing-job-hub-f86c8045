
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CandidateLoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đang tải dữ liệu ứng viên...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateLoadingState;
