const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface BugReportPayload {
  userEmail: string;
  subject: string;
  message: string;
  userAgent: string;
  url: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userEmail, subject, message, userAgent, url, timestamp }: BugReportPayload = await req.json();

    // Create email content
    const emailContent = `
Bug Report from Habit Tracker App

From: ${userEmail}
Subject: ${subject}
Timestamp: ${timestamp}
URL: ${url}
User Agent: ${userAgent}

Message:
${message}

---
This bug report was automatically sent from the Habit Tracker application.
    `.trim();

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment variables');
      throw new Error('Email service not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Bug Reports <noreply@resend.dev>', // Use resend.dev for testing, or your domain
        to: 'lucas.ly.chen@gmail.com',
        subject: `Habit Tracker: ${subject}`,
        text: emailContent,
        reply_to: userEmail
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email');
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bug report sent successfully',
        emailId: emailResult.id
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Error sending bug report:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send bug report: ' + error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});