"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  Receipt,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { numberToIndianWords } from "@/lib/number-to-words";
import InvoicePdfDocument from "@/components/admin/InvoicePdfDocument";

// Dynamic import of PDFDownloadLink to prevent SSR hydration issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span className="text-xs">Preparing PDF...</span> }
);

interface InvoiceDetails {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  eventDate?: string;
  notes?: string;
  subtotal: number;
  discountType: string;
  discountValue: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  advancePaid: number;
  balanceDue: number;
  status: string;
  paymentMode: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    paymentMode: string;
    reference?: string;
    paymentDate: string;
  }>;
}

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paymentRef, setPaymentRef] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const loadInvoice = async () => {
    try {
      const res = await fetch(`/api/admin/invoices/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invoice not found");
      setInvoice(data.invoice);
      setSettings(data.settings || {});
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error loading invoice");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadInvoice();
  }, [id]);

  const handleMarkPaid = async () => {
    if (!invoice) return;
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_paid", paymentMode: "Cash" }),
      });
      if (!res.ok) throw new Error("Failed to mark as paid");
      toast.success("Invoice marked as fully paid!");
      loadInvoice();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount) return;

    setIsSubmittingPayment(true);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_payment",
          paymentAmount,
          paymentMode,
          paymentRef,
        }),
      });
      if (!res.ok) throw new Error("Payment recording failed");
      toast.success("Payment recorded successfully!");
      setPaymentModalOpen(false);
      setPaymentAmount("");
      loadInvoice();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error recording payment");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Invoice deleted");
      router.push("/admin/invoices");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-[#7A6470]">Loading invoice details...</div>;
  }

  if (!invoice) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="text-sm font-semibold text-[#4A1330]">Invoice not found</p>
        <Link href="/admin/invoices" className="text-xs text-[#B76E79] hover:underline">
          Return to invoice list
        </Link>
      </div>
    );
  }

  const cleanPhone = invoice.customer.phone.replace(/[^0-9]/g, "");
  const whatsappSummary = `Hello ${invoice.customer.name}, here is your invoice summary from Neelam Classic Salon & Academy:
Invoice No: ${invoice.invoiceNumber}
Total Amount: ₹${Number(invoice.total).toLocaleString("en-IN")}
Advance Paid: ₹${Number(invoice.advancePaid).toLocaleString("en-IN")}
Balance Due: ₹${Number(invoice.balanceDue).toLocaleString("en-IN")}
Status: ${invoice.status}

Thank you for choosing Neelam Classic!`;
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(whatsappSummary)}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="p-2 rounded-xl bg-white border border-[#F8E8EC] text-[#7A6470] hover:text-[#4A1330] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#4A1330]">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-[#7A6470]">
              Issued to {invoice.customer.name} on{" "}
              {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Share on WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Download PDF */}
          <PDFDownloadLink
            document={<InvoicePdfDocument invoice={invoice} settings={settings} />}
            fileName={`Invoice_${invoice.invoiceNumber}.pdf`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#F8E8EC] text-[#4A1330] text-xs font-semibold hover:bg-[#F8E8EC] transition"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {({ loading }: any) => (
              <>
                <Download className="w-3.5 h-3.5 text-[#B76E79]" />
                <span>{loading ? "Generating..." : "Download PDF"}</span>
              </>
            )}
          </PDFDownloadLink>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#F8E8EC] text-[#4A1330] text-xs font-semibold hover:bg-[#F8E8EC] transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Mark Paid button if balance due */}
          {Number(invoice.balanceDue) > 0 && (
            <button
              onClick={handleMarkPaid}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-[#FFF9F5] text-xs font-semibold hover:opacity-90 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark as Paid</span>
            </button>
          )}

          {/* Record Payment */}
          {Number(invoice.balanceDue) > 0 && (
            <button
              onClick={() => {
                setPaymentAmount(invoice.balanceDue.toString());
                setPaymentModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#4A1330] text-[#FFF9F5] text-xs font-semibold hover:opacity-90 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Payment</span>
            </button>
          )}

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-red-400 hover:text-red-700 hover:bg-red-50 transition"
            title="Delete invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Invoice Card (Printable Area) */}
      <div className="bg-white rounded-3xl border border-[#F8E8EC] p-8 shadow-sm space-y-8">
        {/* Salon Header with Branded Logo */}
        <div className="bg-gradient-to-r from-[#4A1330] to-[#2F001B] text-[#FFF9F5] p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden shadow-lg border-[1.5px] border-[#C9A66B] bg-black">
              <Image
                src="/images/logo-icon.png"
                alt="Neelam Classic Logo"
                width={56}
                height={56}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Neelam Classic</h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A66B] mt-0.5">
                Luxury Salon &amp; Academy Management
              </p>
              <p className="text-xs text-[#F8E8EC]/80 mt-1">
                Founder: Neelam Chourasiya • Studio Contact: {settings.business_phone || "9826747023"}
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C9A66B]/20 text-[#C9A66B] border border-[#C9A66B]/30 uppercase tracking-wider">
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Customer & Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-[#F8E8EC]">
          <div>
            <div className="text-[10px] font-bold text-[#7A6470] uppercase tracking-wider mb-1">
              Billed To Customer
            </div>
            <div className="text-base font-bold text-[#4A1330]">{invoice.customer.name}</div>
            <div className="text-xs text-[#2B1B24] font-mono mt-0.5">{invoice.customer.phone}</div>
            {invoice.customer.email && (
              <div className="text-xs text-[#7A6470]">{invoice.customer.email}</div>
            )}
            {invoice.eventDate && (
              <div className="text-xs font-semibold text-[#B76E79] mt-2">
                Booking Event Date:{" "}
                {new Date(invoice.eventDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </div>

          <div className="sm:text-right space-y-1">
            <div className="text-[10px] font-bold text-[#7A6470] uppercase tracking-wider">
              Invoice Details
            </div>
            <div className="text-xs font-semibold text-[#4A1330]">
              Invoice No: {invoice.invoiceNumber}
            </div>
            <div className="text-xs text-[#7A6470]">
              Date:{" "}
              {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="text-xs text-[#7A6470]">
              Primary Mode: {invoice.paymentMode}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F5] text-[#7A6470] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Service Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Rate</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8E8EC]">
              {invoice.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 px-3 text-[#7A6470]">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-[#2B1B24]">{item.description}</td>
                  <td className="py-3 px-3 text-center">{item.quantity}</td>
                  <td className="py-3 px-3 text-right">₹{Number(item.rate).toLocaleString("en-IN")}</td>
                  <td className="py-3 px-3 text-right">
                    {Number(item.discount) > 0 ? `₹${Number(item.discount).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#4A1330]">
                    ₹{Number(item.amount).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Calculations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F8E8EC]">
          <div>
            <div className="text-[10px] font-bold text-[#7A6470] uppercase tracking-wider mb-1">
              Amount in Words:
            </div>
            <div className="text-xs italic text-[#4A1330] font-medium leading-relaxed">
              {numberToIndianWords(Number(invoice.total))}
            </div>
            {invoice.notes && (
              <div className="mt-4 p-3 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC]">
                <div className="text-[10px] font-bold text-[#7A6470] uppercase mb-1">Notes:</div>
                <div className="text-xs text-[#2B1B24]">{invoice.notes}</div>
              </div>
            )}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#7A6470]">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#2B1B24]">₹{Number(invoice.subtotal).toLocaleString("en-IN")}</span>
            </div>

            {Number(invoice.discountAmount) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span>- ₹{Number(invoice.discountAmount).toLocaleString("en-IN")}</span>
              </div>
            )}

            {Number(invoice.taxAmount) > 0 && (
              <div className="flex justify-between text-[#7A6470]">
                <span>GST ({Number(invoice.taxRate)}%):</span>
                <span>+ ₹{Number(invoice.taxAmount).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between py-2 border-t border-b border-[#4A1330]/20 text-sm font-bold text-[#4A1330]">
              <span>Total Amount:</span>
              <span>₹{Number(invoice.total).toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-emerald-700">
              <span>Advance Paid:</span>
              <span>₹{Number(invoice.advancePaid).toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#B76E79]">
              <span>Balance Due:</span>
              <span>₹{Number(invoice.balanceDue).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Payments History */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="pt-4 border-t border-[#F8E8EC]">
            <div className="text-xs font-bold text-[#4A1330] uppercase tracking-wider mb-2">
              Payment Receipts Log
            </div>
            <div className="space-y-1.5">
              {invoice.payments.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-700">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                    <span className="text-[#7A6470]">via {p.paymentMode}</span>
                    {p.reference && <span className="text-[11px] text-[#7A6470]">({p.reference})</span>}
                  </div>
                  <div className="text-[11px] text-[#7A6470]">
                    {new Date(p.paymentDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#F8E8EC] w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F8E8EC] mb-4">
              <h3 className="font-bold text-sm text-[#4A1330]">Record Part Payment</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 rounded-lg text-[#7A6470] hover:text-[#2B1B24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B1B24] mb-1">
                  Reference / Note (Optional)
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. Transaction UTR #12345"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6470]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#FFF9F5] bg-[#4A1330]"
                >
                  {isSubmittingPayment ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
