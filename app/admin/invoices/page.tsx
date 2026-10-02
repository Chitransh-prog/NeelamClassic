"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Receipt,
  Plus,
  Search,
  Download,
  Share2,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  total: number;
  advancePaid: number;
  balanceDue: number;
  status: string;
  paymentMode?: string;
  customer: {
    name: string;
    phone: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Partially paid": "bg-amber-50 text-amber-700 border-amber-200",
  Unpaid: "bg-rose-50 text-rose-700 border-rose-200",
  Draft: "bg-gray-100 text-gray-700 border-gray-200",
  Cancelled: "bg-gray-200 text-gray-500 border-gray-300",
};

export default function InvoicesListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState({ count: 0, totalRevenue: 0, totalPending: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/invoices?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setInvoices(data.invoices || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [searchQuery, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Invoice deleted");
      loadInvoices();
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  const exportCSV = () => {
    if (invoices.length === 0) return toast.error("No invoices to export");

    const headers = ["Invoice No", "Date", "Customer Name", "Phone", "Total (INR)", "Advance", "Balance Due", "Status", "Mode"];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      new Date(inv.createdAt).toLocaleDateString("en-IN"),
      `"${inv.customer.name.replace(/"/g, '""')}"`,
      inv.customer.phone,
      inv.total,
      inv.advancePaid,
      inv.balanceDue,
      inv.status,
      inv.paymentMode || "Cash",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Invoices_Neelam_Classic_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Invoices CSV downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden shadow-sm border border-[#C9A66B]/60 bg-black hidden sm:block">
            <Image
              src="/images/logo-icon.png"
              alt="Neelam Classic Monogram"
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
              Invoices &amp; Billing
            </h1>
            <p className="text-xs text-[#7A6470] mt-0.5">
              Generate branded salon invoices, track bridal booking advances, and export GST summaries.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#F8E8EC] text-xs font-semibold text-[#4A1330] hover:bg-[#F8E8EC] transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/invoices/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Invoice</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7A6470] uppercase tracking-wider">
            Total Invoices Issued
          </div>
          <div className="text-2xl font-bold text-[#4A1330] mt-1">{summary.count}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7A6470] uppercase tracking-wider">
            Total Billed Revenue
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            ₹{summary.totalRevenue.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-[#7A6470] uppercase tracking-wider">
            Total Balance Due
          </div>
          <div className="text-2xl font-bold text-[#B76E79] mt-1">
            ₹{summary.totalPending.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {["All", "Paid", "Partially paid", "Unpaid", "Draft"].map((st) => (
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

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6470]" />
          <input
            type="text"
            placeholder="Search by invoice #, client, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#F8E8EC] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#7A6470]">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#7A6470]">
            No invoices found. Click &quot;Create New Invoice&quot; to generate your first invoice.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] border-b border-[#F8E8EC] text-[#7A6470] uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Advance</th>
                  <th className="py-3.5 px-4">Balance</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8E8EC]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FFF9F5]/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4A1330]">
                      <Link href={`/admin/invoices/${inv.id}`} className="hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 text-[#7A6470] whitespace-nowrap">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#2B1B24]">{inv.customer.name}</div>
                      <div className="text-[10px] text-[#7A6470] font-mono">{inv.customer.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#4A1330]">
                      ₹{Number(inv.total).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 text-emerald-700">
                      ₹{Number(inv.advancePaid).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#B76E79]">
                      ₹{Number(inv.balanceDue).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          STATUS_COLORS[inv.status] || "bg-gray-100"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="p-1.5 rounded-lg text-[#4A1330] hover:bg-[#F8E8EC] transition"
                          title="View &amp; Print PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
