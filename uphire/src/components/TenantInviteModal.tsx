/**
 * Modal to invite a user to a tenant. Requires tenantId and user must be owner/admin.
 */

import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { inviteUserToTenant, type TenantRole } from "@/services/tenantAdminService";
import { toast } from "@/hooks/use-toast";

const ROLES: { value: TenantRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "recruiter", label: "Recruiter" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "interviewer", label: "Interviewer" },
  { value: "viewer", label: "Viewer" },
];

interface TenantInviteModalProps {
  tenantId: string;
  tenantName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TenantInviteModal({ tenantId, tenantName, isOpen, onClose, onSuccess }: TenantInviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TenantRole>("recruiter");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const result = await inviteUserToTenant({ tenantId, email: email.trim(), role });
      if (result.success) {
        toast({ title: "Invite sent", description: `${email} has been added to ${tenantName}.` });
        setEmail("");
        onSuccess?.();
        onClose();
      } else {
        toast({ title: "Invite failed", description: result.error, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to invite", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus size={20} />
            Invite Team Member
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Invite someone to <strong>{tenantName}</strong>. They must have an account first.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TenantRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "Inviting..." : "Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
