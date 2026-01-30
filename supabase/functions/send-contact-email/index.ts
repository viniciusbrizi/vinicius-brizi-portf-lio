import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const { name, email, message }: ContactRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email, message");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().slice(0, 255);
    const sanitizedMessage = message.trim().slice(0, 1000);

    console.log(`Sending contact email from ${sanitizedName} (${sanitizedEmail})`);

    // Use Resend API directly via fetch
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfólio <onboarding@resend.dev>",
        to: ["brizivinicius@gmail.com"],
        subject: `Nova mensagem do portfólio: ${sanitizedName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a; color: #fafafa; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #111 0%, #1a1a2e 100%); border-radius: 12px; padding: 32px; border: 1px solid #333; }
              .header { text-align: center; margin-bottom: 24px; }
              .header h1 { color: #00d4ff; margin: 0; font-size: 24px; }
              .field { margin-bottom: 20px; }
              .label { color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
              .value { background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 8px; border-left: 3px solid #00d4ff; }
              .message-box { background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; border-left: 3px solid #00d4ff; white-space: pre-wrap; line-height: 1.6; }
              .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #333; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Nova Mensagem do Portfólio</h1>
              </div>
              
              <div class="field">
                <div class="label">Nome</div>
                <div class="value">${sanitizedName}</div>
              </div>
              
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${sanitizedEmail}" style="color: #00d4ff;">${sanitizedEmail}</a></div>
              </div>
              
              <div class="field">
                <div class="label">Mensagem</div>
                <div class="message-box">${sanitizedMessage}</div>
              </div>
              
              <div class="footer">
                Enviado através do portfólio de Vinicius Brizi
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const responseData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", responseData);
      throw new Error(responseData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", responseData);

    return new Response(
      JSON.stringify({ success: true, message: "Email enviado com sucesso!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
