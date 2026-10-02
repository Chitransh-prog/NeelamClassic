"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, Phone, Mail, Receipt, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  invoices: Array<{ id: string; invoiceNumber: string; total: string; status: string }>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const loadCustomers = async () => {
    try {
      const url = searchQuery
        ? `/api/admin/customers?q=${encodeURIComponent(searchQuery)}`
        : "/api/admin/customers";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setCustomers(data.customers || []);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [searchQuery]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, notes }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Customer saved");
      setModalOpen(false);
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      loadCustomers();
    } catch {
      toast.error("Failed to save customer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
            Customer Directory
          </h1>
          <p className="text-xs text-[#7A6470] mt-1">
            Track salon guests, brides, and academy students with complete invoice history.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6470]" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F8E8EC] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#7A6470]">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#7A6470]">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] border-b border-[#F8E8EC] text-[#7A6470] uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Total Invoices</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8E8EC]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FFF9F5]/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-[#4A1330]">{c.name}</td>
                    <td className="py-3.5 px-4 font-mono text-[#2B1B24]">{c.phone}</td>
                    <td className="py-3.5 px-4 text-[#7A6470]">{c.email || "—"}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#FFF9F5] border border-[#F8E8EC] text-[10px] font-bold text-[#4A1330]">
                        {c.invoices.length} invoices
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/invoices/new?name=${encodeURIComponent(
                          c.name
                        )}&phone=${encodeURIComponent(c.phone)}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4A1330] text-[#FFF9F5] font-semibold text-[11px] hover:opacity-90"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>New Invoice</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-sm text-[#4A1330]">Add New Customer</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6470] hover:text-[#2B1B24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9826747023"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pooja@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6470]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330]"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
