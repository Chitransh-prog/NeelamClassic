import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image as PdfImage,
} from "@react-pdf/renderer";
import { numberToIndianWords } from "@/lib/number-to-words";
import { BRAND_LOGO_BASE64 } from "@/lib/logo-data";

// Styles for branded salon invoice
const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#2B1B24",
  },
  header: {
    backgroundColor: "#4A1330",
    padding: 16,
    borderRadius: 8,
    color: "#FFF9F5",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#C9A66B",
    marginRight: 14,
  },
  headerBrand: {
    flexDirection: "column",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF9F5",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 7.5,
    color: "#C9A66B",
    marginTop: 2,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerMeta: {
    fontSize: 8,
    color: "#F8E8EC",
    marginTop: 4,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8E8EC",
  },
  clientBlock: {
    width: "55%",
  },
  invoiceMetaBlock: {
    width: "40%",
    textAlign: "right",
  },
  label: {
    fontSize: 7.5,
    color: "#7A6470",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 2,
  },
  valBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4A1330",
  },
  valText: {
    fontSize: 8.5,
    color: "#2B1B24",
    marginTop: 1,
  },
  table: {
    width: "100%",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8E8EC",
    padding: 6,
    borderRadius: 4,
    color: "#4A1330",
    fontWeight: "bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: "6 4",
    borderBottomWidth: 1,
    borderBottomColor: "#F8E8EC",
    fontSize: 8.5,
  },
  colNo: { width: "7%" },
  colDesc: { width: "48%" },
  colQty: { width: "10%", textAlign: "center" },
  colRate: { width: "15%", textAlign: "right" },
  colDisc: { width: "10%", textAlign: "right" },
  colAmount: { width: "15%", textAlign: "right" },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#4A1330",
  },
  wordsBlock: {
    width: "55%",
    paddingRight: 10,
  },
  wordsText: {
    fontSize: 8,
    color: "#4A1330",
    fontStyle: "italic",
    marginTop: 3,
  },
  calculationsBlock: {
    width: "40%",
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    fontSize: 8.5,
  },
  calcTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginTop: 3,
    borderTopWidth: 1,
    borderTopColor: "#B76E79",
    borderBottomWidth: 1,
    borderBottomColor: "#B76E79",
    fontWeight: "bold",
    color: "#4A1330",
    fontSize: 10,
  },
  dueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontWeight: "bold",
    color: "#B76E79",
    fontSize: 9.5,
  },
  footerSection: {
    marginTop: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F8E8EC",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  termsBlock: {
    width: "60%",
    fontSize: 7.5,
    color: "#7A6470",
    lineHeight: 1.3,
  },
  signatureBlock: {
    width: "35%",
    textAlign: "right",
  },
  signatureLine: {
    marginTop: 35,
    borderTopWidth: 1,
    borderTopColor: "#4A1330",
    paddingTop: 4,
    fontSize: 8,
    fontWeight: "bold",
    color: "#4A1330",
  },
});

interface InvoicePdfProps {
  invoice: {
    invoiceNumber: string;
    createdAt: string;
    eventDate?: string | null;
    notes?: string | null;
    subtotal: string | number;
    discountType?: string;
    discountValue?: string | number;
    discountAmount?: string | number;
    taxRate?: string | number;
    taxAmount?: string | number;
    total: string | number;
    advancePaid: string | number;
    balanceDue: string | number;
    status: string;
    paymentMode?: string | null;
    customer: {
      name: string;
      phone: string;
      email?: string | null;
    };
    items: Array<{
      description: string;
      quantity: number;
      rate: string | number;
      discount?: string | number;
      amount: string | number;
    }>;
  };
  settings?: {
    business_phone?: string;
    invoice_terms?: string;
    invoice_footer_note?: string;
    gst_enabled?: string;
    gstin?: string;
  };
}

export default function InvoicePdfDocument({ invoice, settings }: InvoicePdfProps) {
  const totalNum = Number(invoice.total);
  const amountWords = numberToIndianWords(totalNum);

  return (
    <Document title={`Invoice_${invoice.invoiceNumber}`} author="Neelam Classic Salon">
      <Page size="A4" style={styles.page}>
        {/* Salon Plum Header with Branded Logo */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <PdfImage src={BRAND_LOGO_BASE64} style={styles.headerLogo} />
            <View style={styles.headerBrand}>
              <Text style={styles.headerTitle}>Neelam Classic</Text>
              <Text style={styles.headerSubtitle}>Salon &amp; Academy Management</Text>
              <Text style={styles.headerMeta}>
                Curated by Neelam Chourasiya • Studio Contact: {settings?.business_phone || "9826747023"}
                {settings?.gstin ? ` • GSTIN: ${settings.gstin}` : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Customer & Invoice Meta Details */}
        <View style={styles.infoSection}>
          <View style={styles.clientBlock}>
            <Text style={styles.label}>Billed To Customer</Text>
            <Text style={styles.valBold}>{invoice.customer.name}</Text>
            <Text style={styles.valText}>Phone: {invoice.customer.phone}</Text>
            {invoice.customer.email ? (
              <Text style={styles.valText}>Email: {invoice.customer.email}</Text>
            ) : null}
            {invoice.eventDate ? (
              <Text style={[styles.valText, { marginTop: 4, color: "#B76E79", fontWeight: "bold" }]}>
                Booking Event Date: {new Date(invoice.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </Text>
            ) : null}
          </View>

          <View style={styles.invoiceMetaBlock}>
            <Text style={styles.label}>Tax Invoice</Text>
            <Text style={styles.valBold}>{invoice.invoiceNumber}</Text>
            <Text style={styles.valText}>
              Date: {new Date(invoice.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
            <Text style={styles.valText}>Payment Mode: {invoice.paymentMode || "Cash"}</Text>
            <Text style={[styles.valText, { fontWeight: "bold", color: invoice.status === "Paid" ? "#15803d" : "#B76E79" }]}>
              Status: {invoice.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Service Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>#</Text>
            <Text style={styles.colDesc}>Service Description</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colRate}>Rate (₹)</Text>
            <Text style={styles.colDisc}>Disc</Text>
            <Text style={styles.colAmount}>Amount (₹)</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colNo}>{index + 1}</Text>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colRate}>{Number(item.rate).toLocaleString("en-IN")}</Text>
              <Text style={styles.colDisc}>
                {Number(item.discount || 0) > 0 ? Number(item.discount).toLocaleString("en-IN") : "-"}
              </Text>
              <Text style={styles.colAmount}>{Number(item.amount).toLocaleString("en-IN")}</Text>
            </View>
          ))}
        </View>

        {/* Totals & Currency in Words */}
        <View style={styles.totalsContainer}>
          <View style={styles.wordsBlock}>
            <Text style={styles.label}>Amount in Words (INR)</Text>
            <Text style={styles.wordsText}>{amountWords}</Text>
            {invoice.notes ? (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.label}>Special Booking Notes</Text>
                <Text style={[styles.valText, { fontSize: 8 }]}>{invoice.notes}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.calculationsBlock}>
            <View style={styles.calcRow}>
              <Text style={{ color: "#7A6470" }}>Subtotal:</Text>
              <Text>₹{Number(invoice.subtotal).toLocaleString("en-IN")}</Text>
            </View>

            {Number(invoice.discountAmount || 0) > 0 && (
              <View style={styles.calcRow}>
                <Text style={{ color: "#7A6470" }}>Discount:</Text>
                <Text style={{ color: "#15803d" }}>
                  - ₹{Number(invoice.discountAmount).toLocaleString("en-IN")}
                </Text>
              </View>
            )}

            {Number(invoice.taxAmount || 0) > 0 && (
              <View style={styles.calcRow}>
                <Text style={{ color: "#7A6470" }}>GST ({Number(invoice.taxRate)}%):</Text>
                <Text>+ ₹{Number(invoice.taxAmount).toLocaleString("en-IN")}</Text>
              </View>
            )}

            <View style={styles.calcTotalRow}>
              <Text>Total Amount:</Text>
              <Text>₹{Number(invoice.total).toLocaleString("en-IN")}</Text>
            </View>

            <View style={styles.calcRow}>
              <Text style={{ color: "#7A6470" }}>Advance Paid:</Text>
              <Text>₹{Number(invoice.advancePaid).toLocaleString("en-IN")}</Text>
            </View>

            <View style={styles.dueRow}>
              <Text>Balance Due:</Text>
              <Text>₹{Number(invoice.balanceDue).toLocaleString("en-IN")}</Text>
            </View>
          </View>
        </View>

        {/* Terms, Thank You & Signature */}
        <View style={styles.footerSection}>
          <View style={styles.termsBlock}>
            <Text style={[styles.label, { marginBottom: 3 }]}>Terms &amp; Conditions</Text>
            <Text>{settings?.invoice_terms || "All services once booked are subject to availability. Deposits are non-refundable."}</Text>
            <Text style={{ marginTop: 6, fontStyle: "italic", color: "#4A1330", fontWeight: "bold" }}>
              {settings?.invoice_footer_note || "Thank you for choosing Neelam Classic Salon & Academy!"}
            </Text>
          </View>

          <View style={styles.signatureBlock}>
            <Text style={{ fontSize: 7, color: "#7A6470" }}>For Neelam Classic Salon &amp; Academy</Text>
            <View style={styles.signatureLine}>
              <Text>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
