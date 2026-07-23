import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, company, meetingType, source } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields: name, email, phone' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials not configured for contact save');
    return res.status(200).json({ warning: 'Contact save not configured', stored: false });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert contact by email
    const { data, error } = await supabase
      .from('contacts')
      .upsert(
        {
          email,
          name,
          phone,
          company: company || null,
          meeting_type: meetingType || null,
          source: source || 'booking',
          last_contact: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('[save-contact] Database error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      contact: data?.[0],
      message: `Contact ${email} saved to people management system`,
    });
  } catch (err: any) {
    console.error('[save-contact] Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
