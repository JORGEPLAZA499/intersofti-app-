import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const ticketSchema = z.object({
  category: z.enum(['technical', 'commercial', 'general']),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).nullable().optional(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = ticketSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }), { status: 400, headers: corsHeaders });
    }

    const { category, name, email, phone, subject, message } = parsed.data;

    const ticketNumber = `TK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        ticket_number: ticketNumber,
        category,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
      })
      .select('id, ticket_number')
      .single();

    if (error) {
      console.error('Failed to create ticket:', error);
      return new Response(JSON.stringify({ error: 'Failed to create ticket' }), { status: 500, headers: corsHeaders });
    }

    // Send notification email to support
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-notification',
          recipientEmail: 'info@rpjsoftware.com',
          idempotencyKey: `ticket-${data.id}`,
          templateData: {
            firstName: name,
            lastName: '',
            email,
            message: `[${category.toUpperCase()}] ${subject}\n\nTicket: ${ticketNumber}\n\n${message}`,
          },
        },
      });
    } catch (emailErr) {
      console.error('Failed to send notification email:', emailErr);
    }

    return new Response(JSON.stringify({ id: data.id, ticket_number: data.ticket_number }), { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: corsHeaders });
  }
});
