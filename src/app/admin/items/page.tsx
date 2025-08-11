"use client";

import { useEffect, useMemo, useState } from "react";
import { format, startOfDay, subDays } from "date-fns";

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
  status:
    | "pending"
    | "accepted"
    | "ready"
    | "completed"
    | "cancelled";
  total: number;
  items: OrderItem[];
  deliveryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ItemsAnalyticsPage() {
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
    const itemTotals = new Map<string, { name: string; revenue: number; qty: number }>();
    filtered.forEach((o) => {
      o.items?.forEach((it) => {
        const prev = itemTotals.get(it.id) || { name: it.name, revenue: 0, qty: 0 };
        prev.revenue += (it.price || 0) * (it.quantity || 0);
        prev.qty += it.quantity || 0;
        itemTotals.set(it.id, prev);
      });
    });
    const topItems = Array.from(itemTotals.entries())
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Build daily series for total item revenue
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 30;
    const start = startOfDay(subDays(new Date(), days - 1));
    const byDay = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = startOfDay(subDays(new Date(), days - 1 - i));
      byDay.set(format(d, "yyyy-MM-dd"), 0);
    }
    filtered.forEach((o) => {
      const d = format(startOfDay(new Date(o.createdAt || o.updatedAt)), "yyyy-MM-dd");
      const orderTotalItems = o.items?.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0) || 0;
      if (byDay.has(d)) byDay.set(d, (byDay.get(d) || 0) + orderTotalItems);
    });
    const series = Array.from(byDay.entries()).map(([date, value]) => ({ date, value }));

    return { topItems, series };
  }, [filtered, range]);

  return (
    <>
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

            {/* Chart + Top items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Item revenue over time</p>
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
                  {hoverIdx !== null && metrics.series[hoverIdx] && (
                    <div className="absolute -translate-x-1/2 -translate-y-full px-2 py-1 text-xs bg-white border rounded shadow" style={{ left: `calc(${(hoverIdx / Math.max(1, metrics.series.length - 1)) * 100}% + 36px)`, top: 0 }}>
                      <div className="font-medium">{metrics.series[hoverIdx].date}</div>
                      <div>£{metrics.series[hoverIdx].value.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm font-medium mb-2">Top items</p>
                <div className="divide-y">
                  {metrics.topItems.length === 0 && (
                    <p className="text-sm text-gray-500">No items</p>
                  )}
                  {metrics.topItems.map((it) => (
                    <div key={it.id} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{it.name}</p>
                        <p className="text-xs text-gray-500">Qty {it.qty}</p>
                      </div>
                      <div className="text-right font-medium">£{it.revenue.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Items table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium">All items (top 10)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Item</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Qty</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : metrics.topItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-gray-500">No data</td>
                      </tr>
                    ) : (
                      metrics.topItems.map((it) => (
                        <tr key={it.id}>
                          <td className="px-4 py-2">{it.name}</td>
                          <td className="px-4 py-2 text-right">{it.qty}</td>
                          <td className="px-4 py-2 text-right font-medium">£{it.revenue.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
    </>
  );
}
