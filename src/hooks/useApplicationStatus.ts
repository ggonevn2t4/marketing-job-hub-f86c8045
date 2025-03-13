
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useApplicationStatus = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateApplicationStatus = async (
    applicationId: string,
    status: string,
    candidateId: string
  ) => {
    try {
      setIsLoading(true);

      // Update status in database
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      
      // Send notification to candidate
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'application_update',
            data: {
              applicationId,
              status,
              candidateId,
            },
          }),
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }

      toast({
        title: 'Cập nhật thành công',
        description: 'Trạng thái đơn ứng tuyển đã được cập nhật',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật trạng thái',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateApplicationStatus, isLoading };
};

export default useApplicationStatus;
