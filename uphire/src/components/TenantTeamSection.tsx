/**
 * Team section for My Business - invite members to tenant
 */

import React, { useState, useEffect } from "react";
import { UserPlus, Users, Plus } from "lucide-react";
import { fetchUserTenants, createTenant } from "@/services/tenantsService";
import { TenantInviteModal } from "./TenantInviteModal";
import { toast } from "@/hooks/use-toast";

export function TenantTeamSection() {
  const [tenants, setTenants] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteTenantId, setInviteTenantId] = useState<string | null>(null);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUserTenants().then((t) => {
      setTenants(t);
      setLoading(false);
    });
  }, []);

  const handleCreateTenant = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const tenant = await createTenant(createName.trim());
      if (tenant) {
        setTenants((prev) => [...prev, tenant]);
        setCreateName("");
        toast({ title: "Team created", description: `"${tenant.name}" is ready. Invite members below.` });
      } else {
        toast({ title: "Error", description: "Failed to create team", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const selectedTenant = tenants.find((t) => t.id === inviteTenantId);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <Users size={18} />
        Team Members
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Invite colleagues to your organization. They need an account first.
      </p>
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : tenants.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-3">Create a team to invite members</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Team name"
              className="px-3 py-2 border border-gray-300 rounded-lg w-48"
            />
            <button
              onClick={handleCreateTenant}
              disabled={creating || !createName.trim()}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={16} />
              {creating ? "Creating..." : "Create Team"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <span className="font-medium text-gray-900">{tenant.name}</span>
              <button
                onClick={() => setInviteTenantId(tenant.id)}
                className="px-3 py-1.5 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2"
              >
                <UserPlus size={14} />
                Invite Member
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedTenant && (
        <TenantInviteModal
          tenantId={selectedTenant.id}
          tenantName={selectedTenant.name}
          isOpen={!!inviteTenantId}
          onClose={() => setInviteTenantId(null)}
          onSuccess={() => setInviteTenantId(null)}
        />
      )}
    </div>
  );
}
