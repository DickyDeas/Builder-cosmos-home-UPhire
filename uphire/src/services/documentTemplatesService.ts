/**
 * Document templates service - per-user persistence via Supabase with audit logging
 */

import { supabase } from "@/lib/supabaseClient";
import { logAudit } from "@/services/auditService";
import type { Document } from "@/pages/uphire/types";

export interface DbDocument {
  id: string;
  profile_id?: string;
  name?: string;
  type?: string;
  category?: string;
  last_modified?: string;
  auto_send?: boolean;
  template?: string;
}

function dbDocumentToDocument(d: DbDocument): Document {
  return {
    id: d.id,
    name: d.name || "Untitled",
    type: d.type || "Document",
    category: d.category || "General",
    lastModified: d.last_modified || new Date().toISOString().split("T")[0],
    autoSend: d.auto_send ?? false,
    template: d.template || "Standard",
  };
}

export async function fetchDocumentTemplates(): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .not("profile_id", "is", null)
    .order("last_modified", { ascending: false });

  if (error) {
    console.error("Error fetching document templates:", error);
    return [];
  }

  return (data || []).map((d) => dbDocumentToDocument(d as DbDocument));
}

export async function insertDocumentTemplate(doc: Partial<Document>): Promise<Document | null> {
  const { data: session } = await supabase.auth.getSession();
  const profileId = session?.session?.user?.id;
  if (!profileId) return null;

  const insertPayload = {
    profile_id: profileId,
    name: doc.name || "Untitled",
    type: doc.type || "Document",
    category: doc.category || "General",
    last_modified: doc.lastModified || new Date().toISOString().split("T")[0],
    auto_send: doc.autoSend ?? false,
    template: doc.template || "Standard",
  };

  const { data, error } = await supabase
    .from("documents")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting document:", error);
    return null;
  }

  const created = dbDocumentToDocument(data as DbDocument);
  logAudit({
    userId: profileId,
    action: "document_create",
    resourceType: "document",
    resourceId: created.id,
    metadata: { name: created.name },
  });
  return created;
}
