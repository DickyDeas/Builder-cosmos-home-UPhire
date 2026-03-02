import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Mail, Phone, FileText, X } from "lucide-react";
import { contactConfig } from "@/config/contact";
import { supabase } from "@/lib/supabaseClient";

interface Ticket {
  id: number | string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  created: string;
  updated: string;
}

const initialTickets: Ticket[] = [
  {
    id: 1,
    title: "Unable to create job posting",
    description: "I'm getting an error when trying to create a new job posting.",
    status: "Open",
    priority: "High",
    category: "Technical Issue",
    created: "15/01/2024",
    updated: "15/01/2024",
  },
  {
    id: 2,
    title: "Question about subscription plans",
    description: "What's the difference between Growth and Enterprise plans?",
    status: "Resolved",
    priority: "Medium",
    category: "Billing",
    created: "14/01/2024",
    updated: "14/01/2024",
  },
];

const SupportTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Technical Issue",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user?.id) return;
        const { data, error } = await supabase
          .from("support_tickets")
          .select("id, subject, message, status, created_at, updated_at")
          .eq("user_id", session.session.user.id)
          .order("created_at", { ascending: false });
        if (!error && data?.length) {
          setTickets(
            data.map((t: { id: string; subject: string; message: string; status: string; created_at: string; updated_at: string }) => ({
              id: t.id,
              title: t.subject,
              description: t.message,
              status: t.status === "open" ? "Open" : t.status === "resolved" ? "Resolved" : "Pending",
              priority: "Medium",
              category: "Technical Issue",
              created: new Date(t.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
              updated: new Date(t.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
            }))
          );
        }
      } catch {
        // Keep initial tickets if Supabase not configured
      }
    };
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title.trim()) return;
    const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (userId) {
        const { data, error } = await supabase
          .from("support_tickets")
          .insert({
            user_id: userId,
            subject: newTicket.title.trim(),
            message: newTicket.description.trim() || "No description provided.",
            status: "open",
          })
          .select("id, subject, message, status, created_at, updated_at")
          .single();
        if (!error && data) {
          const ticket: Ticket = {
            id: data.id,
            title: data.subject,
            description: data.message,
            status: "Open",
            priority: newTicket.priority,
            category: newTicket.category,
            created: new Date(data.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
            updated: new Date(data.updated_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
          };
          setTickets((prev) => [ticket, ...prev]);
          setNewTicket({ title: "", description: "", priority: "Medium", category: "Technical Issue" });
          setShowNewTicket(false);
          return;
        }
      }
    } catch {
      // Fall through to local-only
    }
    const ticket: Ticket = {
      id: tickets.length + 1,
      title: newTicket.title.trim(),
      description: newTicket.description.trim() || "No description provided.",
      status: "Open",
      priority: newTicket.priority,
      category: newTicket.category,
      created: now,
      updated: now,
    };
    setTickets((prev) => [ticket, ...prev]);
    setNewTicket({ title: "", description: "", priority: "Medium", category: "Technical Issue" });
    setShowNewTicket(false);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Status" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">
              Manage your support requests and get help from our team.
            </p>
          </div>
          <button
            onClick={() => setShowNewTicket(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Ticket
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option>All Status</option>
            <option>Open</option>
            <option>Resolved</option>
            <option>Pending</option>
          </select>
        </div>

        {showNewTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">New Ticket</h2>
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket((t) => ({ ...t, title: e.target.value }))}
                    placeholder="Brief description of your issue"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket((t) => ({ ...t, description: e.target.value }))}
                    rows={4}
                    placeholder="Provide more details..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket((t) => ({ ...t, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket((t) => ({ ...t, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Billing">Billing</option>
                      <option value="Account">Account</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-12">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ticket.status === "Open"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                      {ticket.priority}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {ticket.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {ticket.created}
                  </span>
                  <span className="flex items-center gap-1 mt-1">
                    <Search className="w-4 h-4" />
                    {ticket.updated}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Other Ways to Reach Us
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <a
                  href={`mailto:${contactConfig.supportEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {contactConfig.supportEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <a
                  href={contactConfig.supportPhone ? `tel:${contactConfig.supportPhone}` : "#"}
                  className="text-blue-600 hover:underline"
                >
                  {contactConfig.supportPhone || "—"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Help Center</p>
                <Link to="/help" className="text-blue-600 hover:underline">
                  Browse articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
