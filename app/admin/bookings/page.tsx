"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Receipt,
  Trash2,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Car,
} from "lucide-react";
import { toast } from "sonner";
import { getWhatsAppUrl } from "@/lib/utils";

interface BookingItem {
  id: string;
  bookingNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  serviceType: string;
  scheduleDate: string;
  scheduleTime?: string | null;
  pickupLocation?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  distanceKm?: number | null;
  deliveryCharges?: number | null;
  serviceAmount?: number | null;
  status: string;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentMode?: string | null;
  notes?: string | null;
  createdAt: string;
}

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    totalRevenue: 0,
    totalPendingDue: 0,
    pendingCount: 0,
    confirmedCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter !== "All") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [searchQuery, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      toast.success(`Booking status updated to ${newStatus}`);
      loadBookings();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheduled booking?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Booking deleted");
      loadBookings();
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  const statusColors: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    Confirmed: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    "On The Way": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse",
    "In Service": "bg-purple-500/10 text-purple-400 border-purple-500/30",
    Completed: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    Cancelled: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Salon Monogram & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden shadow-sm border border-[#C9A66B]/60 bg-black hidden sm:block">
            <Image
              src="/images/logo-icon.png"
              alt="Logo"
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
              Client Appointments &amp; Schedules
            </h1>
            <p className="text-xs text-[#7A6470] mt-0.5">
              Live tracking for bridal pickups, scheduled home visits, meeting dates &amp; advance deposits.
            </p>
          </div>
        </div>

        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] text-xs font-semibold hover:opacity-95 shadow-md shadow-[#4A1330]/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </Link>
      </div>

      {/* 2. Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A6470]">
            Total Bookings
          </div>
          <div className="text-2xl font-bold text-[#4A1330] mt-1">{summary.total}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            Pending Confirmation
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{summary.pendingCount}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Confirmed / Live
          </div>
          <div className="text-2xl font-bold text-sky-700 mt-1">{summary.confirmedCount}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-4 sm:p-5 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#B76E79]">
            Outstanding Balance Due
          </div>
          <div className="text-2xl font-bold text-[#4A1330] font-mono mt-1">
            ₹{summary.totalPendingDue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* 3. Search and Status Tabs */}
      <div className="bg-white rounded-2xl border border-[#F8E8EC] p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#7A6470] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, mobile, service, or location..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {["All", "Pending", "Confirmed", "On The Way", "Completed", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
                statusFilter === st
                  ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs"
                  : "bg-[#FFF9F5] text-[#7A6470] hover:text-[#4A1330]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Bookings Cards List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#7A6470]">
          Loading scheduled appointments...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F8E8EC] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] flex items-center justify-center text-[#B76E79] mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#4A1330]">No Appointments Found</h3>
            <p className="text-xs text-[#7A6470] max-w-md mx-auto mt-1">
              No appointments match your filters. Schedule a new client appointment with live OpenStreetMap pickup location tracking.
            </p>
          </div>
          <Link
            href="/admin/bookings/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4A1330] text-white text-xs font-semibold hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule First Client</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {bookings.map((b) => {
            const dateStr = new Date(b.scheduleDate).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            const hasCoordinates = b.latitude && b.longitude;
            const directionsUrl = hasCoordinates
              ? `https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  b.pickupLocation || ""
                )}`;

            const whatsappMessage = `Namaste ${b.clientName}! Greetings from Neelam Classic Salon & Academy. Your appointment for ${b.serviceType} is scheduled on ${dateStr} at ${b.scheduleTime || "10:30 AM"}. Status: ${b.status}.`;
            const whatsappUrl = `https://wa.me/91${b.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-[#F8E8EC] p-5 shadow-xs hover:border-[#B76E79]/40 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Client & Service Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#C9A66B]">
                        {b.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          statusColors[b.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#4A1330]">{b.clientName}</h3>
                    <p className="text-xs font-semibold text-[#B76E79]">{b.serviceType}</p>
                  </div>

                  {/* Schedule Date & Time Badge */}
                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs font-semibold text-[#4A1330]">
                      <Calendar className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>{dateStr}</span>
                    </div>
                    {b.scheduleTime && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A6470]">
                        <Clock className="w-3 h-3 text-[#C9A66B]" />
                        <span>{b.scheduleTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pickup / Venue Location Box with Live Map Navigation */}
                {b.pickupLocation && (
                  <div className="p-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-[#4A1330]">Pickup / Venue: </span>
                        <span className="text-[#2B1B24] truncate">{b.pickupLocation}</span>
                        {hasCoordinates && (
                          <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            GPS Pinned
                          </span>
                        )}
                        {b.distanceKm !== undefined && b.distanceKm !== null && b.distanceKm > 0 && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#4A1330] font-semibold bg-[#F8E8EC] px-2 py-0.5 rounded-full border border-[#B76E79]/30">
                            <Car className="w-3 h-3 text-[#B76E79]" />
                            <span>{b.distanceKm} km</span>
                            {Number(b.deliveryCharges) > 0 && (
                              <span className="text-[#B76E79] font-bold">
                                (+₹{Number(b.deliveryCharges).toLocaleString("en-IN")})
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#C9A66B]/50 text-[11px] font-semibold text-[#4A1330] hover:bg-[#F8E8EC] transition shrink-0 self-end sm:self-auto"
                    >
                      <Navigation className="w-3 h-3 text-emerald-600" />
                      <span>Directions</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </div>
                )}

                {/* Financials & Action Buttons Bar */}
                <div className="pt-3 border-t border-[#F8E8EC] flex flex-wrap items-center justify-between gap-3">
                  {/* Financial amounts */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[#7A6470] text-[10px] uppercase block">Total</span>
                      <span className="font-bold text-[#4A1330]">
                        ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-700 text-[10px] uppercase block">Advance</span>
                      <span className="font-bold text-emerald-700">
                        ₹{Number(b.advancePaid).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#B76E79] text-[10px] uppercase block">Due</span>
                      <span className="font-bold text-[#B76E79]">
                        ₹{Number(b.balanceDue).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Status updater dropdown */}
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="text-[11px] font-medium px-2 py-1.5 rounded-lg border border-[#F8E8EC] bg-white text-[#4A1330] outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="On The Way">On The Way</option>
                      <option value="In Service">In Service</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* WhatsApp button */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                      title="Send WhatsApp confirmation"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    {/* 1-click invoice create */}
                    <Link
                      href={`/admin/invoices/new?name=${encodeURIComponent(
                        b.clientName
                      )}&phone=${encodeURIComponent(b.clientPhone)}&service=${encodeURIComponent(
                        b.serviceType
                      )}&rate=${Number(b.serviceAmount || b.totalAmount)}&delivery=${Number(b.deliveryCharges || 0)}&distance=${b.distanceKm || 0}&advance=${b.advancePaid}&date=${encodeURIComponent(
                        b.scheduleDate
                      )}&location=${encodeURIComponent(b.pickupLocation || "")}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FFF9F5] border border-[#F8E8EC] text-[11px] font-semibold text-[#4A1330] hover:bg-[#F8E8EC] transition"
                      title="Generate Tax Invoice"
                    >
                      <Receipt className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span className="hidden sm:inline">Invoice</span>
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                      title="Delete appointment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
