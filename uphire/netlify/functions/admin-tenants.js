const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase env vars' }) };
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  let email;
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    email = body.email ? body.email.toLowerCase() : '';
  } catch (err) {
    email = '';
  }

  const staffList = (process.env.UPHIRE_STAFF_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  if (!staffList.includes(email)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const { data, error } = await supabase.from('tenants').select();
  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
  return { statusCode: 200, body: JSON.stringify(data) };
};

