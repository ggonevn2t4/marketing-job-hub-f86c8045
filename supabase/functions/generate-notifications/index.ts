
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { action, data } = await req.json();
    
    if (action === "job_application") {
      await handleJobApplication(supabase, data);
    } else if (action === "job_match") {
      await handleJobMatch(supabase, data);
    } else if (action === "application_update") {
      await handleApplicationUpdate(supabase, data);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleJobApplication(supabase: any, data: any) {
  const { jobId, applicantName } = data;
  
  // Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select("title, company_id")
    .eq("id", jobId)
    .single();
  
  if (!job) throw new Error("Job not found");
  
  // Get company details to find the employer user ID
  const { data: company } = await supabase
    .from("companies")
    .select("metadata")
    .eq("id", job.company_id)
    .single();
  
  if (!company || !company.metadata || !company.metadata.user_id) {
    throw new Error("Employer not found");
  }
  
  const employerId = company.metadata.user_id;
  
  // Create notification for employer
  await supabase.from("notifications").insert({
    user_id: employerId,
    title: "Ứng viên mới",
    message: `${applicantName} đã ứng tuyển vào vị trí "${job.title}"`,
    type: "job_application",
    read: false,
    related_id: jobId,
  });
}

async function handleJobMatch(supabase: any, data: any) {
  const { jobId, candidateId } = data;
  
  // Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select("title, requirements")
    .eq("id", jobId)
    .single();
  
  if (!job) throw new Error("Job not found");
  
  // Get candidate skills
  const { data: skills } = await supabase
    .from("skills")
    .select("name")
    .eq("user_id", candidateId);
  
  if (!skills || skills.length === 0) return;
  
  // Calculate match score (simplified version)
  const skillNames = skills.map((s) => s.name.toLowerCase());
  const jobRequirements = job.requirements?.toLowerCase() || "";
  
  let matchFound = false;
  
  for (const skill of skillNames) {
    if (jobRequirements.includes(skill)) {
      matchFound = true;
      break;
    }
  }
  
  if (matchFound) {
    // Create notification for candidate
    await supabase.from("notifications").insert({
      user_id: candidateId,
      title: "Việc làm phù hợp",
      message: `Chúng tôi tìm thấy một việc làm phù hợp với kỹ năng của bạn: "${job.title}"`,
      type: "job_match",
      read: false,
      related_id: jobId,
    });
  }
}

async function handleApplicationUpdate(supabase: any, data: any) {
  const { applicationId, status, candidateId } = data;
  
  // Get application details
  const { data: application } = await supabase
    .from("job_applications")
    .select("job_id")
    .eq("id", applicationId)
    .single();
  
  if (!application) throw new Error("Application not found");
  
  // Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select("title")
    .eq("id", application.job_id)
    .single();
  
  if (!job) throw new Error("Job not found");
  
  let statusText = "";
  switch (status) {
    case "reviewing":
      statusText = "Đang xem xét";
      break;
    case "interview":
      statusText = "Mời phỏng vấn";
      break;
    case "accepted":
      statusText = "Được chấp nhận";
      break;
    case "rejected":
      statusText = "Bị từ chối";
      break;
    default:
      statusText = status;
  }
  
  // Create notification for candidate
  await supabase.from("notifications").insert({
    user_id: candidateId,
    title: "Cập nhật trạng thái ứng tuyển",
    message: `Đơn ứng tuyển của bạn vào vị trí "${job.title}" đã được cập nhật: ${statusText}`,
    type: "application_update",
    read: false,
    related_id: applicationId,
  });
}
