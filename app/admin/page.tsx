"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Receipt,
  IndianRupee,
  Users,
  Inbox,
  Clock,
  TrendingUp,
  Plus,
  CalendarCheck,
  Palette,
  UploadCloud,
  ArrowRight,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardData {
  cards: {
    invoicesThisMonth: number;
    revenueThisMonth: number;
    pendingPayments: number;
    totalCustomers: number;
    newEnquiries: number;
  };
  revenueChart: Array<{ month: string; revenue: number }>;
  recentInvoices: Array<{
    id: string;
    invoiceNumber: string;
    total: number;
    balanceDue: number;
    status: string;
    createdAt: string;
    customer: { name: string; phone: string };
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-3 border-[#4A1330]/20 border-t-[#4A1330] rounded-full animate-spin" />
        <p className="text-xs font-medium text-[#7A6470]">Loading salon dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#4A1330] via-[#561437] to-[#2F001B] rounded-3xl p-6 sm:p-8 text-[#FFF9F5] shadow-xl border border-[#B76E79]/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C9A66B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A66B] text-[11px] font-semibold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
              <span>Salon &amp; Academy Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF9F5]">
              Welcome, Neelam Chourasiya
            </h1>
            <p className="text-xs sm:text-sm text-[#F8E8EC]/80 mt-1 max-w-xl">
              Track invoices, follow up on incoming bride enquiries, and manage live website content.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/bookings/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A66B] text-[#2F001B] text-xs font-bold hover:opacity-95 transition shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-[#2F001B]" />
              <span>Schedule Client</span>
            </Link>

            <Link
              href="/admin/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF9F5] text-[#4A1330] text-xs font-bold hover:bg-white transition shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#B76E79]" />
              <span>New Invoice</span>
            </Link>

            <Link
              href="/admin/editor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 text-xs font-semibold transition"
            >
              <Palette className="w-4 h-4 text-[#C9A66B]" />
              <span>Edit Website</span>
            </Link>

            <Link
              href="/admin/gallery"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF9F5] border border-white/20 text-xs font-semibold transition"
            >
              <UploadCloud className="w-4 h-4 text-[#B76E79]" />
              <span>Add Photo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Invoices This Month */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6470] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Invoices MTD</span>
            <Receipt className="w-4 h-4 text-[#B76E79]" />
          </div>
          <div className="text-2xl font-bold text-[#4A1330]">
            {data.cards.invoicesThisMonth}
          </div>
          <div className="text-[10px] text-[#7A6470] mt-1">This calendar month</div>
        </div>

        {/* Revenue This Month */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6470] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Revenue MTD</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            ₹{data.cards.revenueThisMonth.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-[#7A6470] mt-1">Total billed value</div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6470] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Balance Due</span>
            <Clock className="w-4 h-4 text-[#B76E79]" />
          </div>
          <div className="text-2xl font-bold text-[#B76E79]">
            ₹{data.cards.pendingPayments.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-[#7A6470] mt-1">Outstanding receivables</div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6470] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-[#C9A66B]" />
          </div>
          <div className="text-2xl font-bold text-[#4A1330]">
            {data.cards.totalCustomers}
          </div>
          <div className="text-[10px] text-[#7A6470] mt-1">Registered clients</div>
        </div>

        {/* New Enquiries */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#7A6470] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">New Enquiries</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {data.cards.newEnquiries}
          </div>
          <div className="text-[10px] text-[#7A6470] mt-1">Pending WhatsApp follow-up</div>
        </div>
      </div>

      {/* 6-Month Revenue Trend Chart */}
      <div className="bg-white rounded-3xl border border-[#F8E8EC] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#4A1330]">6-Month Revenue Growth</h2>
            <p className="text-xs text-[#7A6470]">Monthly billed client revenue in ₹ (INR)</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <TrendingUp className="w-4 h-4" />
            <span>Salon &amp; Academy Growth</span>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueChart}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A1330" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B76E79" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F8E8EC" />
              <XAxis dataKey="month" stroke="#7A6470" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#7A6470"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "#4A1330",
                  borderRadius: "12px",
                  color: "#FFF9F5",
                  border: "none",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#B76E79"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-3xl border border-[#F8E8EC] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#4A1330]">Recent Salon Invoices</h2>
            <p className="text-xs text-[#7A6470]">Latest billed bridal transformations &amp; services</p>
          </div>
          <Link
            href="/admin/invoices"
            className="text-xs font-semibold text-[#B76E79] hover:text-[#4A1330] inline-flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {data.recentInvoices.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#7A6470]">
            No invoices generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF9F5] text-[#7A6470] uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8E8EC]">
                {data.recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FFF9F5]/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#4A1330]">
                      <Link href={`/admin/invoices/${inv.id}`}>{inv.invoiceNumber}</Link>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#2B1B24]">
                      {inv.customer.name}
                    </td>
                    <td className="py-3 px-4 text-[#7A6470]">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#4A1330]">
                      ₹{Number(inv.total).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#B76E79]">
                      ₹{Number(inv.balanceDue).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8E8EC] text-[#4A1330]">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="p-1 rounded-md text-[#7A6470] hover:text-[#4A1330]"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>
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
