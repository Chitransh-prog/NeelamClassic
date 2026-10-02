"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Search,
  MessageCircle,
  Receipt,
  Trash2,
  Calendar,
  Phone,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  status: "New" | "Contacted" | "Booked" | "Closed";
  notes?: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["All", "New", "Contacted", "Booked", "Closed"];

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Contacted: "bg-amber-50 text-amber-700 border-amber-200",
  Booked: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadEnquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setEnquiries(data.enquiries || []);
      }
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter, searchQuery]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      toast.success(`Enquiry marked as ${newStatus}`);
      loadEnquiries();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Enquiry removed");
      loadEnquiries();
    } catch {
      toast.error("Failed to delete enquiry");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
          Client Enquiries &amp; Bookings
        </h1>
        <p className="text-xs text-[#7A6470] mt-1">
          Review incoming website appointment requests, follow up directly on WhatsApp, and generate invoices with 1 click.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                statusFilter === st
                  ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs"
                  : "bg-[#FFF9F5] border border-[#F8E8EC] text-[#7A6470] hover:text-[#2B1B24]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6470]" />
          <input
            type="text"
            placeholder="Search by client or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#F8E8EC] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#7A6470]">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#7A6470]">
            No enquiries found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] border-b border-[#F8E8EC] text-[#7A6470] uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8E8EC]">
                {enquiries.map((enq) => {
                  const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${enq.name}, thank you for contacting Neelam Classic Salon & Academy regarding ${enq.service || "our services"}!`
                  )}`;

                  return (
                    <tr key={enq.id} className="hover:bg-[#FFF9F5]/60 transition">
                      <td className="py-3.5 px-4 text-[#7A6470] whitespace-nowrap">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#4A1330]">{enq.name}</div>
                        {enq.message && (
                          <div className="text-[11px] text-[#7A6470] max-w-xs truncate mt-0.5">
                            {enq.message}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-[#2B1B24] whitespace-nowrap">
                        {enq.phone}
                      </td>

                      <td className="py-3.5 px-4 text-[#2B1B24] font-medium max-w-xs truncate">
                        {enq.service || "General Consultation"}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={enq.status}
                          onChange={(e) => updateStatus(enq.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border outline-none cursor-pointer ${
                            STATUS_COLORS[enq.status] || "bg-gray-100"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Booked">Booked</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Reply on WhatsApp */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition"
                            title="Reply on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Create Invoice */}
                          <Link
                            href={`/admin/invoices/new?name=${encodeURIComponent(
                              enq.name
                            )}&phone=${encodeURIComponent(cleanPhone)}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#4A1330] text-[#FFF9F5] hover:opacity-90 font-semibold text-[11px] transition shadow-xs"
                            title="Generate Invoice"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => deleteEnquiry(enq.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
