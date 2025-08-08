"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { startOfDay, subDays, format } from "date-fns";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  status: "pending" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [range, setRange] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    if (range === "all") return orders;
    const days = range === "7d" ? 7 : 30;
    const start = startOfDay(subDays(new Date(), days - 1));
    return orders.filter((o) => {
      const d = new Date(o.createdAt || o.updatedAt);
      return d >= start;
    });
  }, [orders, range]);

  const metrics = useMemo(() => {
    // Aggregate by customerName + phone as a composite key
    const byCustomer = new Map<string, { name: string; phone: string; orders: number; revenue: number }>();
    filtered.forEach((o) => {
      const key = `${o.customerName}|${o.phone}`;
      const prev = byCustomer.get(key) || { name: o.customerName, phone: o.phone, orders: 0, revenue: 0 };
      prev.orders += 1;
      prev.revenue += o.total || 0;
      byCustomer.set(key, prev);
    });
    const topCustomers = Array.from(byCustomer.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Daily revenue series (for customers overall)
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 30;
    const start = startOfDay(subDays(new Date(), days - 1));
    const byDay = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = startOfDay(subDays(new Date(), days - 1 - i));
      byDay.set(format(d, "yyyy-MM-dd"), 0);
    }
    filtered.forEach((o) => {
      const d = format(startOfDay(new Date(o.createdAt || o.updatedAt)), "yyyy-MM-dd");
      if (byDay.has(d)) byDay.set(d, (byDay.get(d) || 0) + (o.total || 0));
    });
    const series = Array.from(byDay.entries()).map(([date, value]) => ({ date, value }));

    const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = filtered.length;

    return { topCustomers, series, totalRevenue, totalOrders };
  }, [filtered, range]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <nav className="-mb-px flex gap-6 text-sm">
              <Link href="/admin" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Overview</Link>
              <Link href="/admin/today" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Today</Link>
              <Link href="/admin/orders" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Orders</Link>
              <Link href="/admin/items" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Items</Link>
              <span className="border-b-2 border-red-600 pb-2 text-gray-900">Customers</span>
              <Link href="/admin/revenue" className="border-b-2 border-transparent hover:border-gray-300 pb-2 text-gray-600 hover:text-gray-900">Revenue</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Range selector */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Range:</span>
              <div className="flex overflow-hidden rounded-md border">
                {(["7d", "30d", "all"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 text-sm ${range === r ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Orders</p>
                <p className="mt-2 text-2xl font-semibold">{metrics.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Revenue</p>
                <p className="mt-2 text-2xl font-semibold">£{metrics.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Top Customer</p>
                {metrics.topCustomers[0] ? (
                  <div className="mt-2">
                    <p className="text-base font-medium truncate">{metrics.topCustomers[0].name}</p>
                    <p className="text-xs text-gray-500">{metrics.topCustomers[0].phone}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No data</p>
                )}
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs uppercase text-gray-500">Top Customer Revenue</p>
                <p className="mt-2 text-2xl font-semibold">£{(metrics.topCustomers[0]?.revenue || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Chart + Top customers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Revenue by day</p>
                  <p className="text-xs text-gray-500">{range.toUpperCase()}</p>
                </div>
                <div className="relative h-52">
                  {(() => {
                    const data = metrics.series;
                    const width = 800;
                    const height = 200;
                    const padding = { top: 10, right: 10, bottom: 24, left: 36 };
                    const innerW = width - padding.left - padding.right;
                    const innerH = height - padding.top - padding.bottom;
                    const maxY = Math.max(1, ...data.map((d) => d.value));
                    const x = (i: number) => (i / Math.max(1, data.length - 1)) * innerW;
                    const y = (v: number) => innerH - (v / maxY) * innerH;

                    const path = data
                      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.value)}`)
                      .join(" ");
                    const area =
                      `M 0 ${innerH} ` +
                      data.map((d, i) => `L ${x(i)} ${y(d.value)}`).join(" ") +
                      ` L ${innerW} ${innerH} Z`;

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                        <g transform={`translate(${padding.left},${padding.top})`}>
                          {[0, 0.25, 0.5, 0.75, 1].map((fr, idx) => (
                            <line key={idx} x1={0} x2={innerW} y1={y(maxY * fr)} y2={y(maxY * fr)} stroke="#e5e7eb" />
                          ))}
                          <path d={area} fill="rgba(239,68,68,0.15)" />
                          <path d={path} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                          {data.map((d, i) => (
                            <g key={i} onMouseEnter={() => setHoverIdx(i)} onMouseLeave={() => setHoverIdx(null)}>
                              <circle cx={x(i)} cy={y(d.value)} r={hoverIdx === i ? 4 : 3} fill="#ef4444" />
                            </g>
                          ))}
                          {data.map((d, i) => (
                            <text key={i} x={x(i)} y={innerH + 16} fontSize={10} textAnchor="middle" fill="#6b7280">
                              {d.date.slice(5)}
                            </text>
                          ))}
                        </g>
                      </svg>
                    );
                  })()}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm font-medium mb-2">Top customers</p>
                <div className="divide-y">
                  {metrics.topCustomers.length === 0 && (
                    <p className="text-sm text-gray-500">No customers</p>
                  )}
                  {metrics.topCustomers.map((c, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium truncate max-w-[24ch]">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.phone}</p>
                      </div>
                      <div className="text-right font-medium">£{c.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customers table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">Customers (top 10 by revenue)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Customer</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Phone</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Orders</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : metrics.topCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No data</td>
                      </tr>
                    ) : (
                      metrics.topCustomers.map((c, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{c.name}</td>
                          <td className="px-4 py-2">{c.phone}</td>
                          <td className="px-4 py-2 text-right">{c.orders}</td>
                          <td className="px-4 py-2 text-right font-medium">£{c.revenue.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
