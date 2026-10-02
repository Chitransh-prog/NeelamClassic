"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Clock,
  Lock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Milestone,
  Truck,
  Calculator,
  Receipt,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import ScheduleDatePickerModal from "@/components/admin/ScheduleDatePickerModal";

// Dynamic import of Leaflet map to prevent SSR window issues
const OpenSourceLocationPicker = dynamic(
  () => import("@/components/admin/OpenSourceLocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] flex flex-col items-center justify-center text-xs text-[#7A6470] gap-2">
        <div className="w-5 h-5 border-2 border-[#C9A66B]/40 border-t-[#4A1330] rounded-full animate-spin" />
        <span>Loading OpenStreetMap Live Engine...</span>
      </div>
    ),
  }
);

const POPULAR_SERVICES = [
  "Bridal Signature HD Makeup",
  "Bridal Airbrush Artistry",
  "Pre-Bridal Glow Ritual",
  "Engagement / Reception Glamour",
  "Permanent Makeup (PMU) Microblading",
  "Permanent Lip Blush & Tint",
  "Nanoplastia & Hair Keratin Treatment",
  "Advanced Scalp Therapy & Hair Spa",
  "Hydra-Facial & Derma Glow",
  "Professional Academy Masterclass",
];

const TIME_SLOTS = [
  "07:00 AM",
  "09:30 AM",
  "11:00 AM",
  "01:30 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
  "08:00 PM",
];

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Client Info state
  const [clientName, setClientName] = useState(searchParams.get("name") || "");
  const [clientPhone, setClientPhone] = useState(searchParams.get("phone") || "");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceType, setServiceType] = useState(
    searchParams.get("service") || "Bridal Signature HD Makeup"
  );
  const [customService, setCustomService] = useState("");

  // 2. Schedule Date & Time state
  const [scheduleDate, setScheduleDate] = useState<Date>(() => {
    const raw = searchParams.get("date");
    if (raw) {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  });
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("10:30 AM");

  // 3. Pickup / Venue Location state
  const [pickupAddress, setPickupAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // 4. Distance & Delivery / Travel Charges (All Editable!)
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [ratePerKm, setRatePerKm] = useState<number>(50); // Default ₹50/km
  const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
  const [isFreeDelivery, setIsFreeDelivery] = useState<boolean>(false);

  // 5. Status & Financials (All Editable!)
  const [status, setStatus] = useState<string>("Pending");
  const [serviceAmount, setServiceAmount] = useState<number>(15000);
  const [advancePaid, setAdvancePaid] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [autoCreateInvoice, setAutoCreateInvoice] = useState(true);

  // 6. Notes
  const [notes, setNotes] = useState(searchParams.get("notes") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed total = service cost + delivery charge
  const effectiveDelivery = isFreeDelivery ? 0 : Number(deliveryCharges) || 0;
  const totalAmount = (Number(serviceAmount) || 0) + effectiveDelivery;
  const balanceDue = Math.max(0, totalAmount - (Number(advancePaid) || 0));

  const formattedDisplayDate = scheduleDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // When location changes on map, auto-update distance and compute delivery charge
  const handleLocationChange = (loc: {
    address: string;
    lat: number;
    lng: number;
    distanceKm: number;
  }) => {
    setPickupAddress(loc.address);
    setLatitude(loc.lat);
    setLongitude(loc.lng);
    setDistanceKm(loc.distanceKm);

    if (!isFreeDelivery) {
      // Calculate delivery charge: distance * rate/km (rounded to nearest 50)
      const calculated = Math.round(loc.distanceKm * ratePerKm);
      setDeliveryCharges(calculated);
    }
  };

  const handleRecalculateDelivery = () => {
    if (isFreeDelivery) {
      setDeliveryCharges(0);
      return;
    }
    const calculated = Math.round(distanceKm * ratePerKm);
    setDeliveryCharges(calculated);
    toast.success(`Delivery charge updated: ₹${calculated} for ${distanceKm} km`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      toast.error("Please enter Client Name and Mobile Number");
      return;
    }

    setIsSubmitting(true);
    try {
      const finalService =
        serviceType === "Other (Custom)" ? customService || "Custom Service" : serviceType;

      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientEmail,
          serviceType: finalService,
          scheduleDate: scheduleDate.toISOString(),
          scheduleTime,
          pickupLocation: pickupAddress,
          latitude,
          longitude,
          distanceKm,
          deliveryCharges: effectiveDelivery,
          serviceAmount,
          status,
          totalAmount,
          advancePaid,
          paymentMode,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule appointment");

      toast.success(`Booking ${data.booking.bookingNumber} registered!`, {
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      });

      // If user checked "Also generate a branded GST Tax Invoice", route to new invoice with delivery line item!
      if (autoCreateInvoice) {
        const invoiceParams = new URLSearchParams({
          name: clientName,
          phone: clientPhone,
          service: finalService,
          rate: String(serviceAmount),
          delivery: String(effectiveDelivery),
          distance: String(distanceKm),
          advance: String(advancePaid),
          date: scheduleDate.toISOString(),
          location: pickupAddress,
        });
        router.push(`/admin/invoices/new?${invoiceParams.toString()}`);
      } else {
        router.push("/admin/bookings");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error creating booking");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* 1. Header with Back Button and Logo */}
      <div className="flex items-center gap-3.5">
        <Link
          href="/admin/bookings"
          className="p-2.5 rounded-xl bg-white border border-[#F8E8EC] text-[#7A6470] hover:text-[#4A1330] hover:bg-[#FFF9F5] transition shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
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
              New Client Appointment &amp; Schedule
            </h1>
            <p className="text-xs text-[#7A6470] mt-0.5">
              Live pickup &amp; venue location pin, distance-based travel charges, and seamless invoice sync.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================
            CARD 1: CLIENT INFO (Luxury Light Theme)
           ======================================================== */}
        <div className="bg-white border border-[#F8E8EC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1330] pb-2 border-b border-[#F8E8EC]">
            <span className="w-2 h-2 rounded-full bg-[#B76E79]" />
            <span>1. Client Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Name Input */}
            <div className="relative flex items-center bg-[#FFF9F5] border border-[#F8E8EC] rounded-2xl px-4 py-3 focus-within:border-[#B76E79] focus-within:bg-white transition shadow-2xs">
              <User className="w-4 h-4 text-[#7A6470] shrink-0 mr-3" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name *"
                className="w-full text-xs text-[#2B1B24] placeholder-[#7A6470]/60 bg-transparent outline-none font-medium"
              />
            </div>

            {/* Mobile Input */}
            <div className="relative flex items-center bg-[#FFF9F5] border border-[#F8E8EC] rounded-2xl px-4 py-3 focus-within:border-[#B76E79] focus-within:bg-white transition shadow-2xs">
              <Phone className="w-4 h-4 text-[#7A6470] shrink-0 mr-3" />
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Mobile Number *"
                className="w-full text-xs text-[#2B1B24] placeholder-[#7A6470]/60 bg-transparent outline-none font-mono font-medium"
              />
            </div>

            {/* Service Type Dropdown */}
            <div className="sm:col-span-2 relative flex items-center bg-[#FFF9F5] border border-[#F8E8EC] rounded-2xl px-4 py-3 focus-within:border-[#B76E79] focus-within:bg-white transition shadow-2xs">
              <Briefcase className="w-4 h-4 text-[#7A6470] shrink-0 mr-3" />
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full text-xs text-[#2B1B24] bg-transparent outline-none cursor-pointer font-medium"
              >
                {POPULAR_SERVICES.map((s) => (
                  <option key={s} value={s} className="bg-white text-[#2B1B24]">
                    {s}
                  </option>
                ))}
                <option value="Other (Custom)" className="bg-white text-[#2B1B24]">
                  Other / Custom Service
                </option>
              </select>
            </div>

            {serviceType === "Other (Custom)" && (
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={customService}
                  onChange={(e) => setCustomService(e.target.value)}
                  placeholder="Specify custom beauty / bridal service..."
                  className="w-full px-4 py-2.5 text-xs text-[#2B1B24] rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] focus:bg-white outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            CARD 2: MEETING SCHEDULE (Luxury Light Theme)
           ======================================================== */}
        <div className="bg-white border border-[#F8E8EC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1330] pb-2 border-b border-[#F8E8EC]">
            <span className="w-2 h-2 rounded-full bg-[#C9A66B]" />
            <span>2. Meeting Schedule &amp; Timings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Interactive Date Picker Trigger */}
            <div
              onClick={() => setDateModalOpen(true)}
              className="group relative flex items-center justify-between bg-[#FFF9F5] border border-[#F8E8EC] hover:border-[#B76E79] rounded-2xl px-4 py-3.5 cursor-pointer transition select-none shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#F8E8EC] flex items-center justify-center text-[#4A1330] shadow-2xs">
                  <Calendar className="w-4 h-4 text-[#B76E79]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#7A6470]">
                    Schedule Date
                  </div>
                  <div className="text-xs font-bold text-[#4A1330] mt-0.5">
                    {formattedDisplayDate}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#B76E79] group-hover:underline">
                Change
              </span>
            </div>

            {/* Time Slot Picker */}
            <div className="relative flex items-center bg-[#FFF9F5] border border-[#F8E8EC] rounded-2xl px-4 py-3 focus-within:border-[#B76E79] focus-within:bg-white transition shadow-2xs">
              <Clock className="w-4 h-4 text-[#7A6470] shrink-0 mr-3" />
              <div className="flex-1">
                <div className="text-[10px] uppercase font-bold text-[#7A6470]">
                  Appointment Time
                </div>
                <input
                  type="text"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  placeholder="e.g. 10:30 AM"
                  className="w-full text-xs font-bold text-[#4A1330] bg-transparent outline-none mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Quick-Pick Time Chips */}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#7A6470] mb-2">
              Popular Salon &amp; Bridal Slots
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setScheduleTime(slot)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    scheduleTime === slot
                      ? "bg-[#4A1330] text-[#FFF9F5] font-bold shadow-xs"
                      : "bg-[#FFF9F5] border border-[#F8E8EC] text-[#7A6470] hover:text-[#4A1330] hover:bg-white"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            CARD 3: PICKUP LOCATION & LIVE TRACKING (OpenStreetMap)
           ======================================================== */}
        <div className="bg-white border border-[#F8E8EC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F8E8EC]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1330]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3. Pickup &amp; Venue Location (Live Tracking)</span>
            </div>
            <span className="text-[10px] font-mono text-[#C9A66B] font-semibold">
              Open Source Map
            </span>
          </div>

          <OpenSourceLocationPicker
            initialAddress={pickupAddress}
            initialLat={latitude}
            initialLng={longitude}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* ========================================================
            CARD 4: DISTANCE & DELIVERY / TRAVEL CHARGES (ALL EDITABLE!)
           ======================================================== */}
        <div className="bg-white border border-[#F8E8EC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F8E8EC]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1330]">
              <Truck className="w-4 h-4 text-[#B76E79]" />
              <span>4. Delivery &amp; Travel Charges (Distance-Based)</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Fully Editable
            </span>
          </div>

          <p className="text-xs text-[#7A6470] leading-relaxed">
            Travel &amp; logistics charge for bridal venue visits or home appointments, calculated based on distance from the studio. You can edit any value or apply a custom fee.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Distance in KM (Editable) */}
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] shadow-2xs">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6470] mb-1">
                Distance (km)
              </label>
              <div className="flex items-center gap-1.5">
                <Milestone className="w-4 h-4 text-[#C9A66B]" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={distanceKm}
                  onChange={(e) => {
                    const d = parseFloat(e.target.value) || 0;
                    setDistanceKm(d);
                    if (!isFreeDelivery) setDeliveryCharges(Math.round(d * ratePerKm));
                  }}
                  className="w-full text-base font-bold text-[#4A1330] bg-transparent outline-none font-mono"
                />
                <span className="text-xs text-[#7A6470] font-semibold">km</span>
              </div>
            </div>

            {/* 2. Rate per KM (Editable) */}
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] shadow-2xs">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6470] mb-1">
                Rate per KM (₹)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#7A6470]">₹</span>
                <input
                  type="number"
                  min="0"
                  value={ratePerKm}
                  onChange={(e) => {
                    const r = parseFloat(e.target.value) || 0;
                    setRatePerKm(r);
                    if (!isFreeDelivery) setDeliveryCharges(Math.round(distanceKm * r));
                  }}
                  className="w-full text-base font-bold text-[#4A1330] bg-transparent outline-none font-mono"
                />
                <span className="text-xs text-[#7A6470]">/km</span>
              </div>
            </div>

            {/* 3. Final Delivery Charge (Editable) */}
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C9A66B]/40 shadow-2xs">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A1330] mb-1">
                Delivery Charge (₹)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#4A1330]">₹</span>
                <input
                  type="number"
                  min="0"
                  disabled={isFreeDelivery}
                  value={isFreeDelivery ? 0 : deliveryCharges}
                  onChange={(e) => setDeliveryCharges(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-bold text-[#4A1330] bg-transparent outline-none font-mono disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Quick controls: Auto-calculate and Free Travel toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFreeDelivery}
                onChange={(e) => {
                  setIsFreeDelivery(e.target.checked);
                  if (e.target.checked) setDeliveryCharges(0);
                  else setDeliveryCharges(Math.round(distanceKm * ratePerKm));
                }}
                className="w-4 h-4 rounded text-[#4A1330] focus:ring-[#B76E79]"
              />
              <span className="font-semibold text-[#7A6470]">
                Waive travel charges (Complimentary / Studio Appointment)
              </span>
            </label>

            <button
              type="button"
              onClick={handleRecalculateDelivery}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#F8E8EC] text-[11px] font-semibold text-[#4A1330] hover:bg-[#F8E8EC] transition shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#B76E79]" />
              <span>Auto Recalculate (Distance × Rate)</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            CARD 5: STATUS & PAYMENT (WITH DELIVERY BREAKDOWN)
           ======================================================== */}
        <div className="bg-white border border-[#F8E8EC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1330] pb-2 border-b border-[#F8E8EC]">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>5. Status &amp; Financials</span>
          </div>

          <div className="space-y-4">
            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#7A6470] mb-1.5">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] text-xs font-semibold text-[#4A1330] outline-none cursor-pointer shadow-2xs"
              >
                <option value="Pending">Pending Confirmation</option>
                <option value="Confirmed">Confirmed &amp; Scheduled</option>
                <option value="On The Way">On The Way (Live Tracking Active)</option>
                <option value="In Service">In Service / Ritual Ongoing</option>
                <option value="Completed">Completed &amp; Fulfilled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Financial Amounts Grid (Service + Delivery = Total, Advance, Balance) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Service Amount */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A6470] mb-1">
                  Service Amount
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#7A6470]">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={serviceAmount}
                    onChange={(e) => setServiceAmount(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold text-[#4A1330] bg-transparent outline-none font-mono"
                  />
                </div>
              </div>

              {/* Delivery Charge */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#B76E79] mb-1">
                  + Delivery Charge
                </label>
                <div className="text-base font-bold text-[#B76E79] font-mono mt-0.5">
                  ₹{effectiveDelivery.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Total Amount */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-[#C9A66B]/50 shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A1330] mb-1">
                  Total Amount
                </label>
                <div className="text-base font-bold text-[#4A1330] font-mono mt-0.5">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Advance Paid */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] shadow-2xs">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  Advance Deposit
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-emerald-700">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                    className="w-full text-base font-bold text-emerald-700 bg-transparent outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Balance Due Display Card */}
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6470]">
                  Net Balance Due (Locked Calculation)
                </span>
                <div className="text-lg sm:text-xl font-bold text-[#4A1330] font-mono mt-0.5">
                  ₹{balanceDue.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#F8E8EC] text-[#B76E79]">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#7A6470] mb-1.5">
                Payment Mode
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["UPI", "Cash", "Card", "Bank"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 rounded-xl text-xs font-semibold transition ${
                      paymentMode === mode
                        ? "bg-[#4A1330] text-[#FFF9F5] shadow-xs"
                        : "bg-[#FFF9F5] border border-[#F8E8EC] text-[#7A6470] hover:bg-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            CARD 6: NOTES & INVOICE SYNC
           ======================================================== */}
        <div className="bg-white border border-[#F8E8EC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4A1330] pb-2 border-b border-[#F8E8EC]">
            <span className="w-2 h-2 rounded-full bg-[#B76E79]" />
            <span>6. Notes &amp; Invoice Generation</span>
          </div>

          <div className="relative flex items-start bg-[#FFF9F5] border border-[#F8E8EC] rounded-2xl px-4 py-3 focus-within:border-[#B76E79] focus-within:bg-white transition shadow-2xs">
            <MessageSquare className="w-4 h-4 text-[#7A6470] shrink-0 mr-3 mt-1" />
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Comments, bridal draping preferences, jewelry setup details, special pickup instructions..."
              className="w-full text-xs text-[#2B1B24] placeholder-[#7A6470]/60 bg-transparent outline-none resize-none leading-relaxed font-medium"
            />
          </div>

          {/* Invoice Sync Checkbox */}
          <label className="flex items-center gap-3 pt-2 text-xs font-semibold text-[#4A1330] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoCreateInvoice}
              onChange={(e) => setAutoCreateInvoice(e.target.checked)}
              className="rounded text-[#4A1330] focus:ring-[#B76E79] w-4 h-4"
            />
            <span className="flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-[#B76E79]" />
              <span>Automatically add service and delivery charges to Invoice immediately</span>
            </span>
          </label>
        </div>

        {/* ========================================================
            BOTTOM SUBMIT BUTTON
           ======================================================== */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#4A1330] to-[#2F001B] hover:opacity-95 text-[#FFF9F5] text-sm font-semibold tracking-wide shadow-xl shadow-[#4A1330]/20 border border-[#C9A66B]/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registering Appointment...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#C9A66B]" />
              <span>Register &amp; Schedule Appointment</span>
            </>
          )}
        </button>
      </form>

      {/* Date Picker Modal Dialog in Light Theme */}
      <ScheduleDatePickerModal
        isOpen={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        selectedDate={scheduleDate}
        onSelectDate={(newDate) => setScheduleDate(newDate)}
      />
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#7A6470]">
          Loading Appointment Scheduler...
        </div>
      }
    >
      <NewBookingContent />
    </Suspense>
  );
}
