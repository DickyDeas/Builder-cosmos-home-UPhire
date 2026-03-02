/**
 * Netlify serverless function: Post job to job board using tenant credentials
 * POST /api/job-board-post
 */

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) };
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceKey);

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { tenantId, boardId, job } = body;
  if (!tenantId || !boardId || !job) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing tenantId, boardId, or job' }) };
  }

  const { data: license } = await supabase
    .from('tenant_job_board_licenses')
    .select('metadata')
    .eq('tenant_id', tenantId)
    .eq('board_id', boardId)
    .eq('status', 'active')
    .single();

  if (!license?.metadata?.username || !license?.metadata?.api_token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No credentials for this board' }) };
  }

  // Placeholder: actual posting would use board-specific API (Reed, CV-Library, etc.)
  // Each board has different API format - client credentials are in metadata
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, message: 'Job posted (integration pending)' }),
  };
}
