
/**
 * Service to handle Zapier webhook integration
 */

// Get the stored webhook URL
export const getZapierWebhookUrl = (): string | null => {
  return localStorage.getItem('zapier_webhook_url');
};

// Event types that can be sent to Zapier
export type ZapierEventType = 
  | 'user_registration' 
  | 'job_application' 
  | 'job_posted'
  | 'test_connection';

// Send an event to the configured Zapier webhook
export const sendZapierEvent = async (
  eventType: ZapierEventType, 
  data: Record<string, any>
): Promise<boolean> => {
  const webhookUrl = getZapierWebhookUrl();
  
  if (!webhookUrl) {
    console.warn('No Zapier webhook URL configured');
    return false;
  }
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Handle CORS issues
      body: JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        source: 'TopMarketingJobs',
        ...data,
      }),
    });
    
    // Since we're using no-cors, we assume success
    console.log(`Zapier event "${eventType}" sent successfully`);
    return true;
  } catch (error) {
    console.error('Error sending event to Zapier:', error);
    return false;
  }
};
