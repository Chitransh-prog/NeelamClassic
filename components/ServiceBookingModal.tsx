"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Phone,
  User,
  Mail,
  MapPin,
  ChevronDown,
  Building,
  Home,
  Send,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { getWhatsAppUrl, SALON_INFO } from "@/lib/utils";

export interface BookingEventDetail {
  serviceName?: string;
  servicePrice?: string | number;
  categoryName?: string;
}

export function openBookingModal(details?: BookingEventDetail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-service-booking", {
        detail: details || {},
      })
    );
  }
}

const ALL_SERVICES_CATALOG: { name: string; price: string; cat: string }[] = [
  // 1. Curated Signature Sanctuaries (Pavilion Cards)
  { name: "Couture Bridal & High-Definition Makeup", price: "₹15,000", cat: "Signature Sanctuaries" },
  { name: "Advanced Trichology & Hair Architecture", price: "₹2,500", cat: "Signature Sanctuaries" },
  { name: "Derma-Radiance & Body Alchemy", price: "₹1,800", cat: "Signature Sanctuaries" },
  { name: "Micro-Pigmentation & Permanent Cosmetics", price: "₹8,000", cat: "Signature Sanctuaries" },

  // 2. Royal Bridal Transformations
  { name: "Signature HD Bridal Makeup", price: "₹15,000", cat: "Bridal Makeup" },
  { name: "Airbrush Bridal Artistry", price: "₹18,000", cat: "Bridal Makeup" },
  { name: "Royal Bridal HD Makeup", price: "₹12,000", cat: "Bridal Makeup" },
  { name: "Signature Royal Maharani Makeup", price: "₹25,000", cat: "Bridal Makeup" },
  { name: "Engagement / Reception Glamour", price: "₹8,000", cat: "Bridal Makeup" },
  { name: "Pre-Bridal Glow Package (4 Sessions)", price: "₹12,000", cat: "Bridal Makeup" },
  { name: "Pre-Bridal Full Glow Ritual", price: "₹8,500", cat: "Bridal Makeup" },

  // 3. Occasion & Haute Party Makeup
  { name: "Engagement & Roka Makeup", price: "₹4,500", cat: "Party Makeup" },
  { name: "Cocktail / Sangeet Glamour", price: "₹5,500", cat: "Party Makeup" },
  { name: "Haldi & Mehendi Look", price: "₹3,500", cat: "Party Makeup" },
  { name: "Reception Grand Look", price: "₹6,500", cat: "Party Makeup" },
  { name: "Light Day / Corporate Makeup", price: "₹1,500", cat: "Basic Makeup" },
  { name: "Evening Occasion Glamour", price: "₹2,500", cat: "Basic Makeup" },
  { name: "Matte Natural Look", price: "₹2,000", cat: "Basic Makeup" },

  // 4. Clinical Permanent Makeup (PMU)
  { name: "Ombre Powder Eyebrows", price: "₹10,000", cat: "Permanent Makeup (PMU)" },
  { name: "Microblading Feather Brows", price: "₹12,000", cat: "Permanent Makeup (PMU)" },
  { name: "Permanent Lip Blush & Neutralization", price: "₹8,000", cat: "Permanent Makeup (PMU)" },
  { name: "Permanent Lip Blush Tint", price: "₹15,000", cat: "Permanent Makeup (PMU)" },
  { name: "Permanent Eyeliner Definition", price: "₹8,000", cat: "Permanent Makeup (PMU)" },

  // 5. Advanced Hair Trichology & Architecture
  { name: "Nanoplastia Repair Treatment", price: "₹6,000", cat: "Hair Care & Trichology" },
  { name: "Brazilian Keratin Smoothing", price: "₹4,500", cat: "Hair Care & Trichology" },
  { name: "Hair Botox Deep Revival", price: "₹3,500", cat: "Hair Care & Trichology" },
  { name: "Keratin & Nanoplastia Smoothening", price: "₹6,000+", cat: "Hair Care & Trichology" },
  { name: "Bridal Hair Styling & Updo", price: "₹2,500", cat: "Hair Styling" },
  { name: "Global Hair Color & Balayage", price: "₹4,000+", cat: "Hair Care & Trichology" },

  // 6. Derma Radiance & Skin Aesthetics
  { name: "Hydra-Facial Resurfacing & Derma Glow", price: "₹3,500", cat: "Derma & Skin Care" },
  { name: "Korean Glass Skin Ritual", price: "₹4,000", cat: "Derma & Skin Care" },
  { name: "Bridal Full Body Polishing", price: "₹5,500", cat: "Derma & Skin Care" },

  // 7. Academy & Bespoke Consultations
  { name: "Masterclass Mentorship & PMU Diploma", price: "Admissions Open", cat: "Professional Academy" },
  { name: "Professional Academy Masterclass", price: "Admissions Open", cat: "Professional Academy" },
  { name: "Other Custom Service", price: "On Consultation", cat: "Custom & Consultation" },
];

const TIME_SLOTS = [
  "08:00 AM",
  "09:30 AM",
  "11:00 AM",
  "12:30 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
  "08:00 PM",
];

export default function ServiceBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingNumber: string;
    clientName: string;
    serviceType: string;
    scheduleDate: string;
    scheduleTime: string;
    pickupLocation?: string;
  } | null>(null);

  const [availableServices, setAvailableServices] = useState(ALL_SERVICES_CATALOG);

  // Form Fields
  const [serviceName, setServiceName] = useState(ALL_SERVICES_CATALOG[0].name);
  const [servicePrice, setServicePrice] = useState(ALL_SERVICES_CATALOG[0].price);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [scheduleDate, setScheduleDate] = useState(() => {
    // Tomorrow as default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [scheduleTime, setScheduleTime] = useState("11:00 AM");
  const [locationType, setLocationType] = useState<"salon" | "venue">("salon");
  const [venueAddress, setVenueAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [hpField, setHpField] = useState("");

  // Listen for custom open event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<BookingEventDetail>;
      const detail = customEvent.detail || {};

      if (detail.serviceName) {
        const trimmed = detail.serviceName.trim();
        const matched = ALL_SERVICES_CATALOG.find(
          (s) => s.name.toLowerCase() === trimmed.toLowerCase()
        );
        const resolvedPrice = detail.servicePrice
          ? String(detail.servicePrice)
          : matched?.price || "";

        setAvailableServices((prev) => {
          const exists = prev.some(
            (s) => s.name.toLowerCase() === trimmed.toLowerCase()
          );
          if (exists) {
            return prev.map((s) =>
              s.name.toLowerCase() === trimmed.toLowerCase() && resolvedPrice
                ? { ...s, price: resolvedPrice }
                : s
            );
          }
          return [
            {
              name: trimmed,
              price: resolvedPrice,
              cat: detail.categoryName || "Selected Service",
            },
            ...prev,
          ];
        });

        setServiceName(trimmed);
        setServicePrice(resolvedPrice);
      }
      setConfirmedBooking(null);
      setIsOpen(true);
    };

    window.addEventListener("open-service-booking", handleOpen);
    return () => window.removeEventListener("open-service-booking", handleOpen);
  }, []);

  // Listen for query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("book") || params.get("service");
      if (requested) {
        const matched = ALL_SERVICES_CATALOG.find(
          (s) =>
            s.name.toLowerCase().includes(requested.toLowerCase()) ||
            s.cat.toLowerCase().includes(requested.toLowerCase())
        );
        if (matched) {
          setServiceName(matched.name);
          setServicePrice(matched.price);
          setIsOpen(true);
        }
      }
    }
  }, []);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleServiceChange = (name: string) => {
    setServiceName(name);
    const found = availableServices.find((s) => s.name === name);
    if (found && found.price) {
      setServicePrice(found.price);
    }
  };

  // 1. Direct WhatsApp Booking Trigger
  const handleWhatsAppDirect = () => {
    const dateFormatted = scheduleDate
      ? new Date(scheduleDate).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not specified";

    const msg = `Namaste Neelam Classic Salon & Academy!
I would like to book an appointment with you.

✨ *Selected Service:* ${serviceName} ${servicePrice ? `(${servicePrice})` : ""}
📅 *Preferred Date:* ${dateFormatted}
⏰ *Preferred Time:* ${scheduleTime}
📍 *Appointment Type:* ${
      locationType === "salon" ? "In-Salon Studio Visit" : `Home / Venue Visit (${venueAddress || "Address provided upon confirmation"})`
    }
👤 *Client Name:* ${clientName.trim() || "Not provided"}
📞 *Phone Number:* ${clientPhone.trim() || "Not provided"}${
      notes.trim() ? `\n📝 *Notes / Occasion:* ${notes.trim()}` : ""
    }

Please let me know the availability and confirm my booking. Thank you!`;

    const url = getWhatsAppUrl(msg);
    window.open(url, "_blank");
  };

  // 2. Form Submission to DB
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!scheduleDate) {
      toast.error("Please select an appointment date");
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse numeric amount if available
      const cleanNum = parseInt(servicePrice.replace(/[^0-9]/g, ""), 10) || 0;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          clientEmail: clientEmail.trim() || undefined,
          serviceType: `${serviceName}${servicePrice ? ` (${servicePrice})` : ""}`,
          scheduleDate,
          scheduleTime,
          serviceLocationType: locationType,
          pickupLocation: locationType === "venue" ? venueAddress.trim() : "Salon Studio Visit",
          serviceAmount: cleanNum,
          notes: notes.trim() || undefined,
          hp_field: hpField,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      setConfirmedBooking({
        bookingNumber: data.booking?.bookingNumber || "NCB-CONFIRMED",
        clientName: clientName.trim(),
        serviceType: serviceName,
        scheduleDate,
        scheduleTime,
        pickupLocation: locationType === "venue" ? venueAddress.trim() : "Salon Studio Visit",
      });
      toast.success("Appointment request submitted successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Booking request failed. Please book on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#2F001B]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#fef8f4] border border-[#C9A66B]/50 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(47,0,27,0.5)] overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#2F001B] via-[#4A1330] to-[#2F001B] text-[#FFF9F5] px-6 sm:px-8 py-5 border-b border-[#C9A66B]/40 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF9F5]/10 border border-[#C9A66B]/50 flex items-center justify-center text-[#C9A66B]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C9A66B] font-semibold block">
                    Neelam Classic Luxury Salon
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#FFF9F5]">
                    {confirmedBooking ? "Appointment Scheduled" : "Book Service Appointment"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-[#FFF9F5]/10 hover:bg-[#FFF9F5]/20 border border-[#C9A66B]/30 flex items-center justify-center text-[#FFF9F5] transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {confirmedBooking ? (
              /* Success View */
              <div className="text-center space-y-6 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500/40 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#B76E79] tracking-wider uppercase">
                    Slot Request Received
                  </span>
                  <h4 className="text-2xl font-bold text-[#4A1330]">
                    Thank You, {confirmedBooking.clientName}!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#7A6470] max-w-md mx-auto">
                    Your appointment request has been logged in our system. Neelam Chourasiya &amp; team will confirm your slot shortly.
                  </p>
                </div>

                {/* Booking Receipt Summary Card */}
                <div className="bg-[#f8f2ef] rounded-2xl border border-[#C9A66B]/40 p-5 text-left max-w-md mx-auto space-y-3 shadow-inner">
                  <div className="flex items-center justify-between pb-3 border-b border-[#C9A66B]/20">
                    <span className="text-xs text-[#7A6470]">Booking Reference:</span>
                    <span className="font-mono text-xs font-bold text-[#4A1330] bg-[#FFF9F5] px-2.5 py-1 rounded-md border border-[#C9A66B]/30">
                      {confirmedBooking.bookingNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A6470]">Service:</span>
                    <span className="font-semibold text-[#4A1330] text-right">
                      {confirmedBooking.serviceType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A6470]">Schedule:</span>
                    <span className="font-semibold text-[#4A1330]">
                      {new Date(confirmedBooking.scheduleDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      • {confirmedBooking.scheduleTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#7A6470]">Location:</span>
                    <span className="font-semibold text-[#4A1330]">
                      {confirmedBooking.pickupLocation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#C9A66B]/20">
                    <span className="text-[#7A6470]">Status:</span>
                    <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">
                      Pending Salon Confirmation
                    </span>
                  </div>
                </div>

                {/* Next Steps Buttons */}
                <div className="space-y-3 max-w-md mx-auto pt-2">
                  <a
                    href={getWhatsAppUrl(
                      `Namaste Neelam Classic Salon! I just booked an appointment online:
*Booking Ref:* ${confirmedBooking.bookingNumber}
*Client:* ${confirmedBooking.clientName}
*Service:* ${confirmedBooking.serviceType}
*Date & Time:* ${new Date(confirmedBooking.scheduleDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })} at ${confirmedBooking.scheduleTime}
*Location:* ${confirmedBooking.pickupLocation}

Please verify and confirm my slot. Thank you!`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wider shadow-lg transition-all hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm Instantly on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-6 rounded-full bg-[#FFF9F5] border border-[#C9A66B]/50 hover:bg-[#ede7e3] text-[#4A1330] font-semibold text-xs tracking-wider transition"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form View */
              <form onSubmit={handleSubmitForm} className="space-y-5">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="hp_field"
                  value={hpField}
                  onChange={(e) => setHpField(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: "none", position: "absolute", left: "-9999px" }}
                  aria-hidden="true"
                />

                {/* 1. Selected Service Banner / Dropdown */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#f8f2ef] border border-[#C9A66B]/50 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A1330]">
                        Selected Service to Book *
                      </label>
                    </div>
                    {servicePrice && (
                      <span className="font-mono text-xs font-bold text-[#FFF9F5] bg-[#4A1330] px-3 py-0.5 rounded-full border border-[#C9A66B]/40 shadow-xs shrink-0">
                        {servicePrice}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <select
                      value={serviceName}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-white border border-[#C9A66B]/45 text-[#1d1b19] font-medium text-xs sm:text-sm focus:outline-none focus:border-[#4A1330] cursor-pointer appearance-none shadow-2xs"
                    >
                      {availableServices.map((srv) => (
                        <option key={srv.name} value={srv.name}>
                          {srv.name} {srv.price ? `— ${srv.price}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#7A6470] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Client Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7A6470] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Radhika Sen"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#4A1330]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#7A6470] absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. 9826747023"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#4A1330]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Email (optional) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A6470] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. radhika@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#4A1330]"
                    />
                  </div>
                </div>

                {/* 4. Schedule Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                      Appointment Date *
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#7A6470] absolute left-3.5 top-3.5" />
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] focus:outline-none focus:border-[#4A1330] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                      Preferred Time Slot *
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#7A6470] absolute left-3.5 top-3.5 pointer-events-none" />
                      <select
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] focus:outline-none focus:border-[#4A1330] cursor-pointer appearance-none"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#7A6470] absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 5. Appointment Location Type (Salon vs Venue) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                    Location Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLocationType("salon")}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition ${
                        locationType === "salon"
                          ? "bg-[#2F001B] text-[#FFF9F5] border-[#C9A66B]"
                          : "bg-white text-[#7A6470] border-[#C9A66B]/30 hover:border-[#C9A66B]"
                      }`}
                    >
                      <Building className="w-4 h-4 shrink-0 text-[#C9A66B]" />
                      <div className="text-left">
                        <div>Salon Studio</div>
                        <div className="text-[10px] opacity-75 font-normal">At Neelam Classic</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocationType("venue")}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition ${
                        locationType === "venue"
                          ? "bg-[#2F001B] text-[#FFF9F5] border-[#C9A66B]"
                          : "bg-white text-[#7A6470] border-[#C9A66B]/30 hover:border-[#C9A66B]"
                      }`}
                    >
                      <Home className="w-4 h-4 shrink-0 text-[#C9A66B]" />
                      <div className="text-left">
                        <div>Venue / Home Visit</div>
                        <div className="text-[10px] opacity-75 font-normal">Bridal &amp; Occasion</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Venue Address if Venue Visit */}
                {locationType === "venue" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                      Venue Address / Hotel / Landmark *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#7A6470] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required={locationType === "venue"}
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        placeholder="e.g. Hotel Grand, Banquet Hall 2, Civil Lines"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#4A1330]"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 6. Notes / Occasion */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A1330] mb-1.5">
                    Special Notes / Occasion / Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Occasion (Wedding, Reception), skin type, outfit shade, or hair length details..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C9A66B]/40 text-xs sm:text-sm text-[#1d1b19] placeholder:text-[#7A6470]/60 focus:outline-none focus:border-[#4A1330] resize-none"
                  />
                </div>

                {/* TWO BOOKING CHANNELS ACTION BUTTONS */}
                <div className="pt-3 border-t border-[#C9A66B]/25 space-y-3">
                  {/* Primary 1: Submit Form (Online Appointment Record) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#4A1330] to-[#2F001B] hover:opacity-95 text-[#FFF9F5] font-semibold text-xs sm:text-sm tracking-wider shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-[#C9A66B]" />
                    )}
                    <span>{isSubmitting ? "Booking Appointment..." : "Confirm & Book Appointment (Online Form)"}</span>
                  </button>

                  {/* Primary 2: Book with WhatsApp Directly */}
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wider shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Book with WhatsApp Directly</span>
                  </button>

                  <p className="text-[11px] text-[#7A6470] text-center pt-1">
                    Direct helpline: <span className="font-semibold text-[#4A1330]">{SALON_INFO.formattedPhone}</span> • Prior booking ensures dedicated attention
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
