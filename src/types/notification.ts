
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_match' | 'job_application' | 'application_update' | string;
  read: boolean;
  created_at: string;
  related_id?: string;
}
