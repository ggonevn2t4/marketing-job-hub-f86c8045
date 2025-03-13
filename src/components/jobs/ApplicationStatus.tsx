
import { useEffect, useState } from 'react';
import { useApplicationStatus } from '@/hooks/useApplicationStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, XCircle, MailCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplicationStatusProps {
  applicationId: string;
}

const ApplicationStatus = ({ applicationId }: ApplicationStatusProps) => {
  const { status } = useApplicationStatus(applicationId);
  const [statusDetails, setStatusDetails] = useState({
    icon: <Clock className="h-8 w-8" />,
    title: 'Đang xử lý',
    description: 'Đơn ứng tuyển của bạn đang được xem xét.',
    color: 'text-yellow-500'
  });
  
  useEffect(() => {
    switch (status) {
      case 'reviewing':
        setStatusDetails({
          icon: <MailCheck className="h-8 w-8" />,
          title: 'Đang xem xét',
          description: 'Nhà tuyển dụng đang xem xét đơn của bạn.',
          color: 'text-blue-500'
        });
        break;
      case 'shortlisted':
        setStatusDetails({
          icon: <CheckCircle className="h-8 w-8" />,
          title: 'Lọt vào danh sách',
          description: 'Bạn đã lọt vào danh sách ứng viên tiềm năng!',
          color: 'text-green-500'
        });
        break;
      case 'interview':
        setStatusDetails({
          icon: <CheckCircle className="h-8 w-8" />,
          title: 'Phỏng vấn',
          description: 'Bạn được mời phỏng vấn! Nhà tuyển dụng sẽ liên hệ với bạn sớm.',
          color: 'text-green-600'
        });
        break;
      case 'rejected':
        setStatusDetails({
          icon: <XCircle className="h-8 w-8" />,
          title: 'Không phù hợp',
          description: 'Rất tiếc, hồ sơ của bạn không phù hợp với vị trí này.',
          color: 'text-red-500'
        });
        break;
      case 'pending':
      default:
        setStatusDetails({
          icon: <Clock className="h-8 w-8" />,
          title: 'Đang xử lý',
          description: 'Đơn ứng tuyển của bạn đang được xem xét.',
          color: 'text-yellow-500'
        });
    }
  }, [status]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trạng thái đơn ứng tuyển</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={cn("flex-shrink-0", statusDetails.color)}>
            {statusDetails.icon}
          </div>
          <div>
            <h3 className={cn("font-semibold text-lg", statusDetails.color)}>
              {statusDetails.title}
            </h3>
            <p className="text-muted-foreground">
              {statusDetails.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
