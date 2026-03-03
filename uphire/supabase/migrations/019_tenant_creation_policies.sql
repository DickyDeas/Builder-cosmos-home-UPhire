-- 019_tenant_creation_policies.sql
-- Allow authenticated users to create tenants and add themselves as owner

-- Authenticated users can create a new tenant
CREATE POLICY "Authenticated users can create tenants"
  ON tenants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can add themselves as first member of a new tenant (owner)
CREATE POLICY "Users can add themselves to empty tenant"
  ON tenant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id)
  );
