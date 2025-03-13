
import { useEffect, useState } from 'react';
import { jobApplicationsChannel, supabase } from '@/integrations/supabase/client';

export const useApplicationStatus = (applicationId?: string) => {
  const [status, setStatus] = useState<string>('pending');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    // Initial status fetch
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select('status')
        .eq('id', applicationId)
        .single();
      
      if (!error && data) {
        setStatus(data.status);
      }
    };

    fetchStatus();

    // Subscribe to changes
    if (!isSubscribed) {
      jobApplicationsChannel
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'job_applications',
            filter: `id=eq.${applicationId}`
          },
          (payload: any) => {
            if (payload.new && payload.new.status) {
              setStatus(payload.new.status);
            }
          }
        )
        .subscribe((status: any) => {
          if (status === 'SUBSCRIBED') {
            setIsSubscribed(true);
          }
        });
    }

    return () => {
      if (isSubscribed) {
        supabase.removeChannel(jobApplicationsChannel);
        setIsSubscribed(false);
      }
    };
  }, [applicationId, isSubscribed]);

  return { status };
};

export default useApplicationStatus;
