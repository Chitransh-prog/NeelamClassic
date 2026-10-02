"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  Sparkles,
  Receipt,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { numberToIndianWords } from "@/lib/number-to-words";

interface ServiceItem {
  id: string;
  name: string;
  price?: number;
  priceDisplay?: string;
  category?: { name: string };
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
}

function NewInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Customer details
  const [customerName, setCustomerName] = useState(searchParams.get("name") || "");
  const [customerPhone, setCustomerPhone] = useState(searchParams.get("phone") || "");
  const [customerEmail, setCustomerEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");

  // Services catalog for quick line-item selection
  const [catalogServices, setCatalogServices] = useState<ServiceItem[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");

  // Line items state
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Bridal Signature HD Makeup", quantity: 1, rate: 15000, discount: 0 },
  ]);

  // Invoice discount & tax
  const [discountType, setDiscountType] = useState<"flat" | "percent">("flat");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstRate, setGstRate] = useState<number>(18);
  const [advancePaid, setAdvancePaid] = useState<number>(5000);
  const [paymentMode, setPaymentMode] = useState<string>("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load catalog and settings
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then((data) => {
        const flat: ServiceItem[] = [];
        if (data.categories) {
          for (const cat of data.categories) {
            for (const item of cat.items) {
              flat.push({ ...item, category: { name: cat.name } });
            }
          }
        }
        setCatalogServices(flat);
      })
      .catch(() => {});

    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.gst_enabled === "true") setGstEnabled(true);
          if (data.settings.gst_rate) setGstRate(parseFloat(data.settings.gst_rate));
        }
      })
      .catch(() => {});
  }, []);

  // Compute live totals
  const subtotal = items.reduce((acc, item) => {
    const lineAmt = Math.max(0, item.quantity * item.rate - item.discount);
    return acc + lineAmt;
  }, 0);

  let discountAmount = 0;
  if (discountType === "percent") {
    discountAmount = (subtotal * discountValue) / 100;
  } else {
    discountAmount = discountValue;
  }
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const taxAmount = gstEnabled ? (discountedSubtotal * gstRate) / 100 : 0;
  const total = discountedSubtotal + taxAmount;
  const balanceDue = Math.max(0, total - advancePaid);
  const amountWords = numberToIndianWords(total);

  const addLineItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, rate: 0, discount: 0 },
    ]);
  };

  const removeLineItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateLineItem = (idx: number, field: keyof LineItem, val: unknown) => {
    const next = [...items];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (next[idx] as any)[field] = val;
    setItems(next);
  };

  const selectCatalogService = (service: ServiceItem, idx: number) => {
    const next = [...items];
    next[idx].description = service.name;
    next[idx].rate = service.price || 0;
    setItems(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error("Please provide client name and phone");
      return;
    }

    if (items.some((it) => !it.description.trim())) {
      toast.error("All line items must have a service description");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          eventDate: eventDate || null,
          notes,
          items,
          discountType,
          discountValue,
          taxRate: gstEnabled ? gstRate : 0,
          advancePaid,
          paymentMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      toast.success(`Invoice ${data.invoice.invoiceNumber} generated!`);
      router.push(`/admin/invoices/${data.invoice.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error creating invoice");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back button, logo and title */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/invoices"
          className="p-2 rounded-xl bg-white border border-[#F8E8EC] text-[#7A6470] hover:text-[#4A1330] hover:bg-[#FFF9F5] transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden shadow-sm border border-[#C9A66B]/60 bg-black hidden sm:block">
            <Image
              src="/images/logo-icon.png"
              alt="Neelam Classic Monogram"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
              Generate New Invoice
            </h1>
            <p className="text-xs text-[#7A6470] mt-0.5">
              Auto-assigned next gap-safe serial number. Generates branded PDF &amp; WhatsApp share.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information Card */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-xs space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470] pb-2 border-b border-[#F8E8EC]">
            1. Client &amp; Event Booking Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 9826747023"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="pooja@gmail.com"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Event / Wedding Booking Date (Optional)
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                Booking Notes / Special Requests
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bride requested soft champagne eyes, Haldi in morning"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] focus:border-[#B76E79] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Line Items Card */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F8E8EC]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470]">
              2. Services &amp; Line Items
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A1330] text-[#FFF9F5] text-xs font-medium hover:opacity-90 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const lineAmt = Math.max(0, item.quantity * item.rate - item.discount);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Description & catalog picker */}
                    <div className="flex-1 w-full">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Service name (e.g. Signature Bridal HD Makeup)"
                          value={item.description}
                          onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#F8E8EC] focus:border-[#B76E79] outline-none font-medium"
                        />
                        {/* Quick pick dropdown */}
                        <select
                          onChange={(e) => {
                            const found = catalogServices.find((s) => s.id === e.target.value);
                            if (found) selectCatalogService(found, idx);
                          }}
                          className="w-36 px-2 py-2 text-[11px] rounded-xl bg-white border border-[#F8E8EC] text-[#7A6470] outline-none cursor-pointer"
                        >
                          <option value="">⚡ Pick service...</option>
                          {catalogServices.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (₹{s.price || 0})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Qty, Rate, Discount, Amount */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="w-16">
                        <label className="block text-[10px] text-[#7A6470] mb-0.5">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(idx, "quantity", parseInt(e.target.value || "1", 10))
                          }
                          className="w-full px-2 py-1.5 text-xs text-center rounded-lg bg-white border border-[#F8E8EC]"
                        />
                      </div>

                      <div className="w-24">
                        <label className="block text-[10px] text-[#7A6470] mb-0.5">Rate (₹)</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateLineItem(idx, "rate", parseFloat(e.target.value || "0"))
                          }
                          className="w-full px-2 py-1.5 text-xs text-right rounded-lg bg-white border border-[#F8E8EC]"
                        />
                      </div>

                      <div className="w-20">
                        <label className="block text-[10px] text-[#7A6470] mb-0.5">Disc (₹)</label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            updateLineItem(idx, "discount", parseFloat(e.target.value || "0"))
                          }
                          className="w-full px-2 py-1.5 text-xs text-right rounded-lg bg-white border border-[#F8E8EC]"
                        />
                      </div>

                      <div className="w-24 text-right">
                        <label className="block text-[10px] text-[#7A6470] mb-0.5">Amount</label>
                        <div className="text-xs font-bold text-[#4A1330] py-1.5">
                          ₹{lineAmt.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLineItem(idx)}
                        disabled={items.length <= 1}
                        className="p-2 text-red-400 hover:text-red-700 disabled:opacity-20"
                        title="Delete line"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals & Payment Summary Card */}
        <div className="bg-white rounded-2xl border border-[#F8E8EC] p-6 shadow-xs">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7A6470] pb-2 border-b border-[#F8E8EC] mb-4">
            3. Totals, GST, &amp; Payment Details
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Payment Mode & Options */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Invoice Discount
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(parseFloat(e.target.value || "0"))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                    />
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "flat" | "percent")}
                      className="px-2 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                    >
                      <option value="flat">₹ Flat</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(parseFloat(e.target.value || "0"))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank transfer">Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="gstToggle"
                    checked={gstEnabled}
                    onChange={(e) => setGstEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A1330]"
                  />
                  <label htmlFor="gstToggle" className="text-xs font-medium text-[#2B1B24]">
                    Add {gstRate}% GST Tax
                  </label>
                </div>
              </div>

              {/* Amount in words representation */}
              <div className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]">
                <div className="text-[10px] font-semibold text-[#7A6470] uppercase tracking-wider mb-1">
                  Amount in Words:
                </div>
                <div className="text-xs font-medium text-[#4A1330] italic">
                  {amountWords}
                </div>
              </div>
            </div>

            {/* Right: Calculations breakdown */}
            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-[#7A6470]">Subtotal:</span>
                <span className="font-semibold text-[#2B1B24]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between py-1 text-emerald-700">
                  <span>Discount:</span>
                  <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between py-1 text-[#7A6470]">
                  <span>GST ({gstRate}%):</span>
                  <span>+ ₹{taxAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-t border-b border-[#4A1330]/20 text-sm font-bold text-[#4A1330]">
                <span>Grand Total:</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between py-1 text-emerald-700">
                <span>Advance Paid:</span>
                <span>₹{advancePaid.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between py-1 text-base font-bold text-[#B76E79]">
                <span>Balance Due:</span>
                <span>₹{balanceDue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#F8E8EC] flex justify-end gap-3">
            <Link
              href="/admin/invoices"
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-[#7A6470] hover:bg-[#F8E8EC] transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-gradient-to-r from-[#4A1330] to-[#2F001B] hover:opacity-95 shadow-md shadow-[#4A1330]/25 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Invoice...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Generate Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-[#7A6470]">
          Loading invoice builder...
        </div>
      }
    >
      <NewInvoiceContent />
    </Suspense>
  );
}
