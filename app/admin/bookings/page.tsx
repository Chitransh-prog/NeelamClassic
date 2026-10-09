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
  ExternalLink,
  Car,
  Eye,
  Edit3,
  X,
  Copy,
  Check,
  CalendarDays,
  Filter,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

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
  const [dateFilter, setDateFilter] = useState<"All" | "Today" | "Tomorrow" | "ThisWeek" | "Past">("All");

  // Modals state
  const [detailModalBooking, setDetailModalBooking] = useState<BookingItem | null>(null);
  const [editBooking, setEditBooking] = useState<BookingItem | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    serviceType: "",
    scheduleDate: "",
    scheduleTime: "",
    pickupLocation: "",
    serviceAmount: 0,
    deliveryCharges: 0,
    totalAmount: 0,
    advancePaid: 0,
    balanceDue: 0,
    paymentMode: "UPI",
    status: "Pending",
    notes: "",
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (detailModalBooking?.id === id) setDetailModalBooking(null);
      if (editBooking?.id === id) setEditBooking(null);
      loadBookings();
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  // Open Edit Modal
  const openEditModal = (booking: BookingItem) => {
    setEditBooking(booking);
    setEditForm({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      clientEmail: booking.clientEmail || "",
      serviceType: booking.serviceType,
      scheduleDate: new Date(booking.scheduleDate).toISOString().split("T")[0],
      scheduleTime: booking.scheduleTime || "11:00 AM",
      pickupLocation: booking.pickupLocation || "",
      serviceAmount: Number(booking.serviceAmount || 0),
      deliveryCharges: Number(booking.deliveryCharges || 0),
      totalAmount: Number(booking.totalAmount || 0),
      advancePaid: Number(booking.advancePaid || 0),
      balanceDue: Number(booking.balanceDue || 0),
      paymentMode: booking.paymentMode || "UPI",
      status: booking.status,
      notes: booking.notes || "",
    });
  };

  // Handle Edit Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;

    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/bookings/${editBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: editForm.clientName,
          clientPhone: editForm.clientPhone,
          clientEmail: editForm.clientEmail || null,
          serviceType: editForm.serviceType,
          scheduleDate: editForm.scheduleDate,
          scheduleTime: editForm.scheduleTime,
          pickupLocation: editForm.pickupLocation || null,
          serviceAmount: Number(editForm.serviceAmount) || 0,
          deliveryCharges: Number(editForm.deliveryCharges) || 0,
          totalAmount: Number(editForm.totalAmount) || 0,
          advancePaid: Number(editForm.advancePaid) || 0,
          paymentMode: editForm.paymentMode,
          status: editForm.status,
          notes: editForm.notes || null,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to update booking");
      }

      toast.success("Booking details updated successfully!");
      setEditBooking(null);
      loadBookings();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Date Filter Logic
  const filteredBookings = bookings.filter((b) => {
    if (dateFilter === "All") return true;

    const bDate = new Date(b.scheduleDate);
    bDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    if (dateFilter === "Today") {
      return bDate.getTime() === today.getTime();
    }
    if (dateFilter === "Tomorrow") {
      return bDate.getTime() === tomorrow.getTime();
    }
    if (dateFilter === "ThisWeek") {
      return bDate >= today && bDate <= weekEnd;
    }
    if (dateFilter === "Past") {
      return bDate < today;
    }
    return true;
  });

  const copyBookingNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(true);
    toast.success("Booking reference copied!");
    setTimeout(() => setCopiedId(false), 2000);
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
            <h1 className="text-2xl font-serif font-semibold tracking-tight text-[#4A1330]">
              Client Appointments &amp; Schedules
            </h1>
            <p className="text-xs text-[#7A6470] mt-0.5">
              Live management for online form bookings, WhatsApp visits, bridal dates &amp; advance deposits.
            </p>
          </div>
        </div>

        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A1330] hover:bg-[#2F001B] text-[#FFF9F5] text-xs font-semibold uppercase tracking-wider shadow-xs transition-all shrink-0 cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-[#F8E8EC] p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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

          {/* Date quick filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-[#7A6470] uppercase tracking-wider flex items-center gap-1 mr-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Date:</span>
            </span>
            {[
              { id: "All", label: "All Dates" },
              { id: "Today", label: "Today" },
              { id: "Tomorrow", label: "Tomorrow" },
              { id: "ThisWeek", label: "This Week" },
              { id: "Past", label: "Past" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDateFilter(d.id as typeof dateFilter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                  dateFilter === d.id
                    ? "bg-[#C9A66B] text-[#2F001B] font-bold shadow-xs"
                    : "bg-[#FFF9F5] text-[#7A6470] hover:text-[#4A1330]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="pt-2 border-t border-[#F8E8EC] flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-[#7A6470] uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {["All", "Pending", "Confirmed", "On The Way", "Completed", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition ${
                statusFilter === st
                  ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs font-semibold"
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
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#F8E8EC] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] flex items-center justify-center text-[#B76E79] mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#4A1330]">No Appointments Found</h3>
            <p className="text-xs text-[#7A6470] max-w-md mx-auto mt-1">
              No appointments match your filters. Schedule a new client appointment or clear filters.
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
          {filteredBookings.map((b) => {
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

            const whatsappMessage = `Namaste ${b.clientName}! Greetings from Neelam Classic Salon & Academy. Your appointment for ${b.serviceType} is scheduled on ${dateStr} at ${b.scheduleTime || "11:00 AM"}. Status: ${b.status}. Total: ₹${Number(b.totalAmount).toLocaleString("en-IN")}, Balance Due: ₹${Number(b.balanceDue).toLocaleString("en-IN")}.`;
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
                    <div className="text-[11px] text-[#7A6470] flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#B76E79]" /> {b.clientPhone}
                      </span>
                      {b.clientEmail && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#B76E79]" /> {b.clientEmail}
                        </span>
                      )}
                    </div>
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
                        <span className="font-semibold text-[#4A1330]">Location: </span>
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

                {/* Notes if provided */}
                {b.notes && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-[11px] text-[#4A1330]">
                    <span className="font-semibold">Notes: </span>
                    <span>{b.notes}</span>
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
                  <div className="flex items-center gap-1.5 flex-wrap">
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

                    {/* View Details Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setDetailModalBooking(b)}
                      className="p-1.5 px-2 rounded-lg bg-[#FFF9F5] border border-[#F8E8EC] text-[11px] font-semibold text-[#4A1330] hover:bg-[#F8E8EC] transition flex items-center gap-1"
                      title="View complete appointment dossier"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B76E79]" />
                      <span>Details</span>
                    </button>

                    {/* Edit Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => openEditModal(b)}
                      className="p-1.5 px-2 rounded-lg bg-[#FFF9F5] border border-[#F8E8EC] text-[11px] font-semibold text-[#4A1330] hover:bg-[#F8E8EC] transition flex items-center gap-1"
                      title="Edit booking parameters"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>Edit</span>
                    </button>

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

      {/* 5. VIEW DETAILS MODAL */}
      {detailModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#F8E8EC] shadow-2xl p-6 sm:p-7 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F8E8EC]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C9A66B]">
                    {detailModalBooking.bookingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyBookingNumber(detailModalBooking.bookingNumber)}
                    className="p-1 rounded hover:bg-[#F8E8EC] text-[#7A6470]"
                    title="Copy reference"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      statusColors[detailModalBooking.status] || "bg-gray-100"
                    }`}
                  >
                    {detailModalBooking.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#4A1330] mt-1">
                  Appointment Details
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalBooking(null)}
                className="w-8 h-8 rounded-full bg-[#FFF9F5] border border-[#F8E8EC] flex items-center justify-center text-[#7A6470] hover:text-[#4A1330]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Client & Service Section */}
            <div className="bg-[#FFF9F5] rounded-2xl p-4 border border-[#F8E8EC] space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#7A6470]">Client:</span>
                <span className="font-bold text-[#4A1330] text-sm">
                  {detailModalBooking.clientName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6470]">Mobile:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#4A1330]">
                    {detailModalBooking.clientPhone}
                  </span>
                  <a
                    href={`tel:+91${detailModalBooking.clientPhone.replace(/[^0-9]/g, "")}`}
                    className="p-1 rounded bg-white border border-[#C9A66B]/30 text-[#4A1330] hover:bg-[#F8E8EC]"
                    title="Call Client"
                  >
                    <Phone className="w-3 h-3 text-[#B76E79]" />
                  </a>
                </div>
              </div>
              {detailModalBooking.clientEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-[#7A6470]">Email:</span>
                  <span className="text-[#4A1330]">{detailModalBooking.clientEmail}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-[#F8E8EC]">
                <span className="text-[#7A6470]">Booked Service:</span>
                <span className="font-bold text-[#B76E79] text-right">
                  {detailModalBooking.serviceType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6470]">Date &amp; Slot:</span>
                <span className="font-semibold text-[#4A1330]">
                  {new Date(detailModalBooking.scheduleDate).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  at {detailModalBooking.scheduleTime || "11:00 AM"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#7A6470]">Location / Venue:</span>
                <span className="font-medium text-[#4A1330] text-right max-w-xs">
                  {detailModalBooking.pickupLocation || "Salon Studio"}
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]">
                <span className="text-[10px] text-[#7A6470] uppercase block">Total</span>
                <span className="font-bold font-mono text-[#4A1330] text-sm mt-0.5 block">
                  ₹{Number(detailModalBooking.totalAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase block">Advance</span>
                <span className="font-bold font-mono text-emerald-700 text-sm mt-0.5 block">
                  ₹{Number(detailModalBooking.advancePaid).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-[#B76E79] uppercase block">Balance Due</span>
                <span className="font-bold font-mono text-[#B76E79] text-sm mt-0.5 block">
                  ₹{Number(detailModalBooking.balanceDue).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {detailModalBooking.notes && (
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-[#4A1330]">
                <span className="font-bold block mb-0.5">Special Notes / Occasion:</span>
                <p>{detailModalBooking.notes}</p>
              </div>
            )}

            {/* WhatsApp Template Actions */}
            <div className="space-y-2 pt-2 border-t border-[#F8E8EC]">
              <span className="text-[11px] font-semibold text-[#7A6470] uppercase tracking-wider block">
                Quick WhatsApp Actions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/91${detailModalBooking.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Namaste ${detailModalBooking.clientName}! Greetings from Neelam Classic Salon & Academy. Your appointment for ${detailModalBooking.serviceType} is CONFIRMED on ${new Date(detailModalBooking.scheduleDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at ${detailModalBooking.scheduleTime || "11:00 AM"}. Location: ${detailModalBooking.pickupLocation || "Salon Studio"}. See you soon!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Confirmation</span>
                </a>

                <a
                  href={`https://wa.me/91${detailModalBooking.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Namaste ${detailModalBooking.clientName}! This is a gentle reminder from Neelam Classic Salon regarding your upcoming appointment for ${detailModalBooking.serviceType} on ${new Date(detailModalBooking.scheduleDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} at ${detailModalBooking.scheduleTime || "11:00 AM"}. Please reach 10 minutes prior.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F8E8EC]">
              <button
                type="button"
                onClick={() => {
                  const b = detailModalBooking;
                  setDetailModalBooking(null);
                  openEditModal(b);
                }}
                className="px-4 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs font-semibold text-[#4A1330] hover:bg-[#F8E8EC]"
              >
                Edit Booking
              </button>
              <button
                type="button"
                onClick={() => setDetailModalBooking(null)}
                className="px-4 py-2 rounded-xl bg-[#4A1330] text-white text-xs font-semibold hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. EDIT BOOKING MODAL */}
      {editBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#F8E8EC] shadow-2xl p-6 sm:p-7 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F8E8EC]">
              <div>
                <span className="font-mono text-xs font-bold text-[#C9A66B]">
                  {editBooking.bookingNumber}
                </span>
                <h3 className="text-lg font-bold text-[#4A1330] mt-0.5">
                  Edit Appointment Details
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditBooking(null)}
                className="w-8 h-8 rounded-full bg-[#FFF9F5] border border-[#F8E8EC] flex items-center justify-center text-[#7A6470] hover:text-[#4A1330]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.clientName}
                    onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.clientPhone}
                    onChange={(e) => setEditForm({ ...editForm, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                  Client Email (Optional)
                </label>
                <input
                  type="email"
                  value={editForm.clientEmail}
                  onChange={(e) => setEditForm({ ...editForm, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* Service & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                    Service Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.serviceType}
                    onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                    Booking Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79] cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="On The Way">On The Way</option>
                    <option value="In Service">In Service</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                    Schedule Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editForm.scheduleDate}
                    onChange={(e) => setEditForm({ ...editForm, scheduleDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                    Schedule Time
                  </label>
                  <input
                    type="text"
                    value={editForm.scheduleTime}
                    onChange={(e) => setEditForm({ ...editForm, scheduleTime: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                  Pickup Location / Venue Address
                </label>
                <input
                  type="text"
                  value={editForm.pickupLocation}
                  onChange={(e) => setEditForm({ ...editForm, pickupLocation: e.target.value })}
                  placeholder="e.g. Salon Studio or Client Venue Address"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79]"
                />
              </div>

              {/* Financials: Amount, Advance, Due */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6470] block">
                  Financial Amounts &amp; Payments (₹)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-[#7A6470] mb-1">Service Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.serviceAmount}
                      onChange={(e) => {
                        const srv = Number(e.target.value) || 0;
                        const tot = srv + (Number(editForm.deliveryCharges) || 0);
                        const bal = Math.max(0, tot - (Number(editForm.advancePaid) || 0));
                        setEditForm({
                          ...editForm,
                          serviceAmount: srv,
                          totalAmount: tot,
                          balanceDue: bal,
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F8E8EC] text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#7A6470] mb-1">Advance Paid</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.advancePaid}
                      onChange={(e) => {
                        const adv = Number(e.target.value) || 0;
                        const bal = Math.max(0, (Number(editForm.totalAmount) || 0) - adv);
                        setEditForm({
                          ...editForm,
                          advancePaid: adv,
                          balanceDue: bal,
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F8E8EC] text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#7A6470] mb-1">Total Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.totalAmount}
                      onChange={(e) => {
                        const tot = Number(e.target.value) || 0;
                        const bal = Math.max(0, tot - (Number(editForm.advancePaid) || 0));
                        setEditForm({
                          ...editForm,
                          totalAmount: tot,
                          balanceDue: bal,
                        });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#F8E8EC] text-xs font-mono outline-none font-bold text-[#4A1330]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F8E8EC]">
                  <span className="text-[#7A6470]">Calculated Balance Due:</span>
                  <span className="font-mono font-bold text-[#B76E79]">
                    ₹{(Number(editForm.balanceDue) || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4A1330] mb-1 uppercase tracking-wider">
                  Admin &amp; Client Notes
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Special instructions, bridal requirements, or payment remarks..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs text-[#1d1b19] outline-none focus:border-[#B76E79] resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F8E8EC]">
                <button
                  type="button"
                  onClick={() => setEditBooking(null)}
                  className="px-4 py-2 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs font-semibold text-[#7A6470] hover:text-[#4A1330]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-white text-xs font-bold hover:opacity-95 disabled:opacity-50 transition"
                >
                  {isSavingEdit ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
