-- 018_tenant_users_admin_policies.sql
-- Allow tenant owners/admins to invite users (INSERT) and remove users (DELETE)

CREATE OR REPLACE FUNCTION is_tenant_owner_or_admin(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_id = p_tenant_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Owners/admins can insert new tenant_users (invite)
CREATE POLICY "Tenant owners and admins can invite users"
  ON tenant_users FOR INSERT
  WITH CHECK (is_tenant_owner_or_admin(tenant_id));

-- Owners/admins can delete tenant_users (remove member)
CREATE POLICY "Tenant owners and admins can remove users"
  ON tenant_users FOR DELETE
  USING (is_tenant_owner_or_admin(tenant_id));
