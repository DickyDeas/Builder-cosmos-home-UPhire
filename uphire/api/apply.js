/**
 * Netlify serverless function: Handle job applications from job boards
 * POST /api/apply - creates candidate in Supabase
 */

import { createClient } from '@supabase/supabase-js';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { role_id, name, email, phone, experience, skills, source } = body;
  if (!role_id || !name || !email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: role_id, name, email' }) };
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data: role } = await supabase.from('roles').select('profile_id').eq('id', role_id).single();
  if (!role) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Role not found' }) };
  }

  const insertPayload = {
    role_id,
    name,
    email,
    phone: phone || null,
    status: 'new',
  };

  const { data: candidate, error } = await supabase
    .from('candidates')
    .insert(insertPayload)
    .select('id')
    .single();

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: candidate.id, success: true }),
  };
}
