import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      invoicesThisMonth,
      allActiveInvoices,
      totalCustomers,
      newEnquiriesCount,
      recentInvoices,
    ] = await withDbRetry(async () => {
      return await Promise.all([
        // Invoices this month
        prisma.invoice.findMany({
          where: {
            isSoftDeleted: false,
            createdAt: { gte: startOfMonth },
          },
          select: { total: true, advancePaid: true, balanceDue: true },
        }),

        // All active invoices for overall stats & charts
        prisma.invoice.findMany({
          where: { isSoftDeleted: false },
          select: { total: true, balanceDue: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        }),

        // Total customers count
        prisma.customer.count(),

        // New enquiries count
        prisma.enquiry.count({
          where: { status: "New" },
        }),

        // Top 5 recent invoices
        prisma.invoice.findMany({
          where: { isSoftDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { customer: true },
        }),
      ]);
    });

    // Month metrics
    const invoicesCountMonth = invoicesThisMonth.length;
    let revenueThisMonth = 0;
    for (const inv of invoicesThisMonth) {
      revenueThisMonth += Number(inv.total);
    }

    // Pending payments overall
    let totalPendingPayments = 0;
    for (const inv of allActiveInvoices) {
      totalPendingPayments += Number(inv.balanceDue);
    }

    // 6-Month revenue chart aggregation
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartMap: Record<string, number> = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      chartMap[key] = 0;
    }

    for (const inv of allActiveInvoices) {
      const d = new Date(inv.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (chartMap[key] !== undefined) {
        chartMap[key] += Number(inv.total);
      }
    }

    const revenueChart = Object.entries(chartMap).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    return NextResponse.json({
      cards: {
        invoicesThisMonth: invoicesCountMonth,
        revenueThisMonth,
        pendingPayments: totalPendingPayments,
        totalCustomers,
        newEnquiries: newEnquiriesCount,
      },
      revenueChart,
      recentInvoices,
    });
  } catch (err: unknown) {
    console.error("Dashboard metrics error:", err);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}
