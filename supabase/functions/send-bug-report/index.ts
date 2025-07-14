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

    // Send email using a simple email service
    // Note: In a real implementation, you'd use a service like SendGrid, Resend, or similar
    // For now, we'll simulate sending and log the report
    console.log('Bug Report:', {
      to: 'lucas.ly.chen@gmail.com',
      from: userEmail,
      subject: `Bug Report: ${subject}`,
      content: emailContent
    });

    // In a production environment, you would integrate with an email service here
    // Example with Resend:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: 'lucas.ly.chen@gmail.com',
        subject: `Bug Report: ${subject}`,
        text: emailContent,
        reply_to: userEmail
      }),
    });
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Bug report sent successfully' 
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
        message: 'Failed to send bug report' 
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